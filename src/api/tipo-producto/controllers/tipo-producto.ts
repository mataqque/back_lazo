import type { Strapi } from '@strapi/strapi';
/**
 * tipo-producto controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tipo-producto.tipo-producto');
// export default {
// 	exampleAction: async (ctx, next) => {
// 		try {
// 			ctx.body = 'ok';
// 			return 'ok';
// 		} catch (err) {
// 			console.log(err);
// 			ctx.body = err;
// 		}
// 	},
// };
