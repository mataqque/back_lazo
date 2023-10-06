import type { Strapi } from '@strapi/strapi';
/**
 * tipo-producto controller
 */

import { factories } from '@strapi/strapi';

// export const customRouter = factories.createCoreController('api::tipo-producto.tipo-producto', ({ strapi }: { strapi: Strapi }) => ({
// 	async findAll(ctx) {
// 		const entries = await strapi.db.query('api::tipo-producto.tipo-producto').findMany({});

// 		ctx.body = entries;
// 	},
// }));
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
};
