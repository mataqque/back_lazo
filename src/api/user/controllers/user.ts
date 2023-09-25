/**
 * A set of functions called "actions" for `user`
 */
const failedLoginAttempts = {};
const maxFailedAttempts = 3;
const blockTime = 600000; // 10 minutos
const HOST_API_WPP = process.env.HOST_API_WPP;
import { factories } from '@strapi/strapi';
import { SchemaUser, SchemaUserGoogle } from '../schema';
import { pick } from 'lodash';
import { IUserDatabase, IUserRequestGoogle } from '../interface';
import { changePasswordSchema, codeVerificationSchema, credentialSchema, recoveryPasswordSchema } from './schema';
import axios from 'axios';
import { generateRandomNumber } from '../../../helpers/helpers';

const COUNTATTEMPS = 4;

async function blockedAttempts(user: IUserDatabase) {
	const entry = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
		data: {
			blocked: true,
		},
	});
	return {
		message: 'blocked Email',
		verificated: false,
	};
}
async function updateAttemps(user: IUserDatabase, init = false) {
	if (user.attempts < COUNTATTEMPS) {
		const entry = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
			data: {
				attempts: init ? 0 : user.attempts + 1,
			},
		});
		return {
			verificated: false,
		};
	}
}

function dataResolve(user: IUserDatabase) {
	return {
		id: user.id,
		verificated: true,
		username: user.username,
		email: user.email,
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
			return { message: error.message };
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
			const validate = credentialSchema.validateSync(ctx.request.body);
			const { email, password } = pick(validate, Object.keys(credentialSchema.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email } });
			if (!user || user.password == null || user.blocked == true) return { verificated: false };
			if (user.attempts >= COUNTATTEMPS) return blockedAttempts(user);
			const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, user.password);
			if (validPassword === true) {
				updateAttemps(user, true);
				return dataResolve(user);
			}
			if (validPassword === false) return updateAttemps(user);
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
			if (!user) return { verificated: false };
			if (user.code !== code) return { verificated: false };
			if (user.code == code) {
				return {
					verificated: true,
					status: 200,
				};
			}
		} catch (err) {
			return { message: err.message };
		}
	},
	changePasswordCode: async (ctx, next) => {
		try {
			const validate = changePasswordSchema.validateSync(ctx.request.body);
			const { email, code, password } = pick(validate, Object.keys(changePasswordSchema.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email } });
			if (user.code !== code) return { verificated: false };
			const updatePassword = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
				data: {
					password: password,
					code: null,
					blocked: false,
					attempts: 0,
				},
			});
			return { verificated: true, status: 200, type: 'changed' };
		} catch (err) {
			return { message: err.message };
		}
	},
	recoveryPassword: async (ctx, next) => {
		try {
			const validate = recoveryPasswordSchema.validateSync(ctx.request.body);
			const { email } = pick(validate, Object.keys(recoveryPasswordSchema.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: email } });
			if (!user) return { message: 'User not found', status: 401 };
			//
			const code: string = generateRandomNumber(6, 6);
			const updateCode = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
				data: {
					code: code,
				},
			});
			sendMessage(user.cel, `Hola ${user.firstname}, su código de recuperacion es: ${code}`);

			return { verificated: true, status: 200, type: 'changepassword' };
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
		try {
			const validate = SchemaUser.validateSync(ctx.request.body);
			const filterdata = pick(validate, Object.keys(SchemaUser.fields));
			const user: IUserDatabase = await strapi.db.query('plugin::users-permissions.user').findOne({
				where: { email: validate.email },
			});

			if (user && user.email == filterdata.email) return { status: 405, message: 'Email ya registrado' };

			const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
				data: filterdata,
			});

			return { status: 200, message: 'registro Exitoso', require };
		} catch (err) {
			return { status: 405, message: err.message };
		}
	},
	createAccountGoogle: async (ctx, next) => {
		try {
			const dataUser: IUserRequestGoogle = ctx.request.body;
			async function dataUserGoogle(data) {
				const showUser = await strapi.entityService.findMany('plugin::users-permissions.user', {
					populate: ['role'],
					filters: {
						email: data.email,
					},
				});
				return showUser[0];
			}
			if (dataUser) {
				const validate = SchemaUserGoogle.validateSync(dataUser);
				const filteredData = pick(validate, Object.keys(SchemaUserGoogle.fields));
				const verifyuser = await strapi.db.query('plugin::users-permissions.user').findOne({
					where: { email: validate.email },
				});

				if (verifyuser && verifyuser.username == filteredData.email && verifyuser.provider == 'google') {
					return dataUserGoogle(filteredData);
				} else {
					const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
						data: filteredData,
					});

					return dataUserGoogle(filteredData);
				}
			} else {
				return { status: 405, message: 'datos inclompletos' };
			}
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
	// 					verificated: true,
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
	// 					verificated: false,
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
	// 				verificated: false,
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
