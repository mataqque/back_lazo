/**
 * ventaproducto router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter('api::ventaproducto.ventaproducto');
const customRouter = (innerRouter, extraRoutes = []) => {
	let routes;
	return {
		get prefix() {
			return innerRouter.prefix;
		},
		get routes() {
			if (!routes) routes = innerRouter.routes.concat(extraRoutes);
			return routes;
		},
	};
};

const myExtraRoutes = [
	{
		method: 'POST',
		path: '/ventaproductos/extends',
		handler: 'extends.prove',
		config: {
			policies: [],
			middlewares: [],
		},
	},
];

export default customRouter(defaultRouter, myExtraRoutes);
