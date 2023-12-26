/**
 * A set of functions called "actions" for `user`
 */
const failedLoginAttempts = {};
const maxFailedAttempts = 3;
const blockTime = 600000; // 10 minutos
const HOST_API_WPP = process.env.HOST_API_WPP;
import { factories } from '@strapi/strapi';
import { SchemaUser, SchemaUserGoogle, getSchemaUser, updateUser } from '../schema';
import { pick } from 'lodash';
import { IUserDatabase, IUserRequestGoogle } from '../interface';
import { changePasswordSchema, codeVerificationSchema, credentialSchema, phoneVerificationSchema, recoveryPasswordSchema } from './schema';
import axios from 'axios';
import { generateRandomNumber } from '../../../helpers/helpers';
import { Context } from 'koa';

const COUNT_ATTEMPTS = 15;
const COUNT_ATTEMPTS_IP = 20;

async function blockedAttempts(user: IUserDatabase) {
	const entry = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
		data: {
			blocked: true,
		},
	});
	return {
		message: 'blocked Email',
		verified: false,
	};
}
async function updateAttempts(user: IUserDatabase, init = false) {
	if (user.attempts < COUNT_ATTEMPTS) {
		const entry = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
			data: {
				attempts: init ? 0 : user.attempts + 1,
			},
		});
		return {
			verified: false,
		};
	}
}
async function veriedIp(ip: string) {
	const findIp = await strapi.db.query('api::listaip.listaip').findOne({
		where: { ip: ip },
	});
	console.log(findIp);
	if (findIp && findIp.blocked == true) {
		return false;
	}
	if (findIp && findIp.blocked == false) {
		return findIp;
	}
	if (!findIp) {
		const entry = await strapi.entityService.create('api::listaip.listaip', {
			data: {
				ip: ip,
				blocked: false,
				attempts: 0,
				publishedAt: new Date(),
			},
		});
		return entry;
	}
	return false;
}
interface IIp {
	ip: string;
	blocked: boolean;
	attempts: number;
}
async function blockedIp(dataIp: IIp) {
	const { ip, blocked, attempts } = dataIp;
	if (attempts >= COUNT_ATTEMPTS_IP) {
		console.log('its here');
		const updateIp = strapi.db.query('api::listaip.listaip').update({
			where: { ip: ip },
			data: {
				blocked: true,
			},
		});
	} else {
		const updateIp = strapi.db.query('api::listaip.listaip').update({
			where: { ip: ip },
			data: {
				attempts: attempts + 1,
			},
		});
	}
}
function dataResolve(user: IUserDatabase) {
	return {
		id: user.id,
		verified: true,
		username: user.username,
		email: user.email,
		firstname: user.firstname,
		lastname: user.lastname,
		cel: user.phone,
		gender: user.gender,
		birthday: user.birthday,
	};
}

async function sendMessage(cel: string, message: string) {
	const response = await axios({
		url: HOST_API_WPP + '/sendMessage',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		data: JSON.stringify({ cel: cel, message: message }),
	})
		.then(response => {
			return response.data;
		})
		.catch(error => {
			return { message: error.message, status: 404 };
		});
	return response;
}

export default {
	exampleAction: async (ctx, next) => {
		try {
			ctx.body = 'ok';
			return 'ok';
		} catch (err) {
			console.log(err);
			ctx.body = err;
		}
	},
	verifyUserByEmail: async (ctx, next) => {
		try {
			const { ip } = ctx.request.body;
			const dataIp = await veriedIp(ip);
			if (dataIp == false) {
				return { status: 404, message: 'IP Bloqueada' };
			}
			const validate = credentialSchema.validateSync(ctx.request.body);
			const { email, password } = pick(validate, Object.keys(credentialSchema.fields));

			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email } });
			if (!user || user.password == null || user.blocked == true) {
				blockedIp(dataIp);
				return { status: 405, verified: false };
			}
			if (user.attempts >= COUNT_ATTEMPTS) {
				blockedIp(dataIp);
				return blockedAttempts(user);
			}
			const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, user.password);
			if (validPassword === true) {
				updateAttempts(user, true);
				return dataResolve(user);
			}
			if (validPassword === false) return updateAttempts(user);
		} catch (err) {
			return { message: err.message };
		}
	},
	codeVerification: async (ctx, next) => {
		try {
			const validate = codeVerificationSchema.validateSync(ctx.request.body);
			const { email, code } = pick(validate, Object.keys(codeVerificationSchema.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email } });

			console.log(user);
			if (!user) return { verified: false };
			if (user.code !== code) return { verified: false };
			if (user.code == code) {
				return {
					verified: true,
					status: 200,
				};
			}
		} catch (err) {
			return { message: err.message };
		}
	},
	phoneverification: async (ctx, next) => {
		console.log('its here', ctx.request.body);
		const ip = ctx.request.header['x-forwarded-for'];
		try {
			const dataIp = await veriedIp(ip);
			if (dataIp == false) {
				return { status: 404, message: 'IP Bloqueada' };
			}
			const validate = phoneVerificationSchema.validateSync(ctx.request.body);
			const { phone } = pick(validate, Object.keys(phoneVerificationSchema.fields));
			const code = generateRandomNumber(6, 6);
			const findPhone = await strapi.db.query('api::phone.phone').findOne({ where: { phone: phone } });
			console.log(phone);
			if (findPhone) {
				blockedIp(dataIp);
				const updateCode = await strapi.entityService.update('api::phone.phone', findPhone.id, {
					data: {
						code: code,
					},
				});
			} else {
				const newPhone = await strapi.entityService.create('api::phone.phone', {
					data: {
						phone: phone,
						publishedAt: new Date(),
						code: code,
					},
				});
			}
			const message = await sendMessage(phone, `Gracias por registrarte, su código de verificación es: ${code}`);
			if (message.status == 404) return { message: 'No se pudo enviar', status: message.status };
			return { verified: true, status: 200, type: 'phone' };
		} catch (err) {
			console.log({ err });
			return { message: err.message, status: 404, type: 'phone' };
		}
	},
	changePasswordCode: async (ctx, next) => {
		try {
			const validate = changePasswordSchema.validateSync(ctx.request.body);
			const { email, code, password } = pick(validate, Object.keys(changePasswordSchema.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email } });
			if (user.code !== code) return { verified: false };
			const updatePassword = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
				data: {
					password: password,
					code: null,
					blocked: false,
					attempts: 0,
				},
			});
			return { verified: true, status: 200, type: 'changed' };
		} catch (err) {
			return { message: err.message };
		}
	},
	recoveryPassword: async (ctx: any, next) => {
		try {
			const validate = recoveryPasswordSchema.validateSync(ctx.request.body);
			const { email } = pick(validate, Object.keys(recoveryPasswordSchema.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email }, populate: ['phone'] });
			console.table(user);
			if (!user) return { message: 'User not found', status: 401 };
			if (user && !user?.phone?.phone) return { message: 'User Cel not found', status: 401 };
			//
			const code: string = generateRandomNumber(6, 6);
			const updateCode = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
				data: {
					code: code,
				},
			});
			const message = await sendMessage(user.phone.phone, `Hola ${user.firstname}, su código de recuperacion es: ${code}`);
			console.log(message);
			if (message.status == 404) return { message: message.message, status: message.status };
			return { verified: true, status: 200, type: 'changepassword' };
		} catch (err) {
			return { message: err.message, status: 401 };
		}
	},
	sendMailtoVerify: async (ctx, next) => {
		try {
			const result = await strapi.plugins['email'].services.email.send({
				to: 'mataqque.100@gmail.com',
				from: 'LazoTiendadeDetalles@gmail.com',
				subject: 'Bienvenido a Lazo, espero formar parte de tu vida en esos lindos momentos, te lo agradece el gerente de Lazo muchas gracias.',
				text: 'Este es un correo electrónico de prueba enviado desde Strapi.',
			});
			return { message: 'send message' };
		} catch (error) {
			return { message: 'error' };
		}
	},

	createAccount: async (ctx, next) => {
		const ip = ctx.request.header['x-forwarded-for'];
		try {
			const dataIp = await veriedIp(ip);
			if (dataIp == false) {
				return { status: 404, message: 'IP Bloqueada' };
			}
			const validate = SchemaUser.validateSync(ctx.request.body);
			const filterdata = pick(validate, Object.keys(SchemaUser.fields));
			const dataPhone = await strapi.db.query('api::phone.phone').findOne({
				where: { phone: filterdata.phone },
			});
			console.log(dataPhone);
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({
				where: { email: validate.email },
			});

			if ((dataPhone && user && user.email == filterdata.email) || dataPhone?.verified == true) {
				blockedIp(dataIp);
				return { status: 401, message: 'Email ya registrado y/o celular verificado' };
			}

			if (dataPhone.code == filterdata.code) {
				const { email, firstname, username, lastname, password, gender } = filterdata;
				const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
					data: {
						email,
						firstname,
						username,
						lastname,
						password,
						gender,
						phone: dataPhone.id,
						provider: 'local',
					},
				});
				const verifiedPhone = await strapi.entityService.update('api::phone.phone', dataPhone.id, {
					data: {
						verified: true,
					},
				});
				return { status: 200, message: 'registro Exitoso' };
			}
			blockedIp(dataIp);
			return { status: 405, message: 'El Codigo es incorrecto' };
		} catch (err) {
			return { status: 404, message: err.message };
		}
	},
	updateUser: async (ctx, next) => {
		try {
			console.log(ctx.request.body);
			const validate = updateUser.validateSync(ctx.request.body);
			const filterdata = pick(validate, Object.keys(updateUser.fields));
			console.log({ filterdata });
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({
				where: { email: validate.email },
			});
			const newUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
				data: { ...filterdata, provider: 'local' },
			});

			return { status: 200, message: 'Actualizacion Exitosa' };
		} catch (err) {
			return { status: 405, message: err.message };
		}
	},
	getUser: async (ctx, next) => {
		try {
			console.log(ctx.request.body);
			const validate = getSchemaUser.validateSync(ctx.request.body);
			const filterdata = pick(validate, Object.keys(getSchemaUser.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({
				where: { email: validate.email },
			});
			dataResolve(user);
			return { status: 200, data: dataResolve(user) };
		} catch (err) {
			return { status: 405, message: err.message };
		}
	},

	createAccountGoogle: async (ctx, next) => {
		try {
			const validate = SchemaUserGoogle.validateSync(ctx.request.body);
			const filterdata: IUserRequestGoogle = pick(validate, Object.keys(SchemaUserGoogle.fields));

			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({
				where: { email: filterdata.email },
			});

			if (user && user.email == filterdata.email && user.provider == 'local') return { status: 405, message: 'Email ya registrado' };
			if (user && user.email == filterdata.email) return { status: 200, data: dataResolve(user) };

			const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
				data: { ...filterdata, provider: 'google' },
			});
			return { status: 200, data: dataResolve(newUser) };
		} catch (err) {
			//removed
			return { message: err };
		}
	},
	// verifyUserByEmail: async (ctx, next) => {
	// 	const { email, password, ip } = ctx.request.body;

	// 	try {
	// 		const findIp =
	// 			(await strapi.db.query('api::listaip.listaip').findOne({
	// 				where: { ip: ip },
	// 			})) || null;

	// 		if (findIp && findIp['attempts'] < 4 && findIp['blocked'] == false) {
	// 			const entries = await strapi.db.query('plugin::users-permissions.user').findOne({
	// 				where: { email: email },
	// 			});
	// 			const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, entries.password);
	// 			if (validPassword) {
	// 				return {
	// 					verified: true,
	// 					username: entries.username,
	// 					email: entries.email,
	// 				};
	// 			} else {
	// 				const entry = await strapi.entityService.update('api::listaip.listaip', findIp.id, {
	// 					data: {
	// 						attempts: findIp.attempts + 1,
	// 					},
	// 				});
	// 				return {
	// 					findIp: findIp,
	// 					verified: false,
	// 				};
	// 			}
	// 		} else if (findIp['attempts'] >= 4) {
	// 			const entry = await strapi.entityService.update('api::listaip.listaip', findIp.id, {
	// 				data: {
	// 					blocked: true,
	// 				},
	// 			});
	// 			return {
	// 				message: 'blocked IP',
	// 				verified: false,
	// 			};
	// 		} else {
	// 			await strapi.entityService.create('api::listaip.listaip', {
	// 				data: {
	// 					ip: ip,
	// 					attempts: 1,
	// 				},
	// 			});
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		ctx.body = err;
	// 	}
	// },
};
