export default {
	routes: [
		{
			method: 'POST',
			path: '/mercadopago',
			handler: 'mercadopago.createPayment',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/mercadopago/form',
			handler: 'mercadopago.addForm',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};
