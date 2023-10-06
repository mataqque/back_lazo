/**
 * tipo-producto router
 */

import { factories } from '@strapi/strapi';
import { createCoreRouter } from '@strapi/strapi/lib/factories';

export default createCoreRouter('api::tipo-producto.tipo-producto');

// const customRouter = (innerRouter, routeOveride = [], extraRoutes = []) => {
// 	let routes;

// 	return {
// 		get prefix() {
// 			return innerRouter.prefix;
// 		},
// 		get routes() {
// 			if (!routes) routes = innerRouter.routes;

// 			const newRoutes = routes.map(route => {
// 				let found = false;

// 				routeOveride.forEach(overide => {
// 					if (route.handler === overide.handler && route.method === overide.method) {
// 						found = overide;
// 					}
// 				});

// 				return found || route;
// 			});

// 			return newRoutes.concat(extraRoutes);
// 		},
// 	};
// };

// const myOverideRoute = [
// 	{
// 		method: 'GET',
// 		path: '/custom-tipo-producto',
// 		handler: 'tipo-producto.exampleAction',
// 	},
// ];
// const myExtraRoutes = [];
// module.exports = customRouter(defaultRouter, myOverideRoute, myExtraRoutes);
