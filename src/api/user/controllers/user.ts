/**
 * A set of functions called "actions" for `user`
 */
const failedLoginAttempts = {};
const maxFailedAttempts = 3;
const blockTime = 600000; // 10 minutos

import { factories } from '@strapi/strapi';
import { SchemaUser } from '../schema';
import { pick } from 'lodash';
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
		const { email, password } = ctx.request.body;

		try {
			// const entries = await strapi.db.query('api::producto.producto').findOne({
			// 	where: { id: 1 },
			// });
			const entries = await strapi.db.query('plugin::users-permissions.user').findOne({
				where: { email: email },
			});

			if (entries && entries['attempts'] < 4 && entries['blocked'] == false) {
				const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, entries.password);
				if (validPassword) {
					return {
						verificated: true,
						username: entries.username,
						email: entries.email,
					};
				} else {
					const entry = await strapi.entityService.update('plugin::users-permissions.user', entries.id, {
						data: {
							attempts: entries.attempts + 1,
						},
					});
					return {
						verificated: false,
					};
				}
			} else if (entries['attempts'] >= 4) {
				const entry = await strapi.entityService.update('plugin::users-permissions.user', entries.id, {
					data: {
						blocked: true,
					},
				});
				return {
					message: 'blocked Email',
					verificated: false,
				};
			} else {
				return {
					message: 'blocked Email',
					verificated: false,
				};
			}
		} catch (err) {
			console.log(err);
			ctx.body = err;
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
		const dataUser = ctx.request.body;
		try {
			if (dataUser) {
				const validate = SchemaUser.validateSync(dataUser);
				const filteredData = pick(validate, Object.keys(SchemaUser.fields));
				const verifyuser = await strapi.db.query('plugin::users-permissions.user').findOne({
					where: { email: validate.email },
				});
				if (verifyuser) {
					return {
						message: 'User exist',
					};
				}
				const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
					data: filteredData,
				});

				return newUser;
			} else {
				return { message: 'datos inclompletos' };
			}
		} catch (err) {
			return { message: err.message };
		}

		return ctx.request.body;
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
