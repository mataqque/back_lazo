export default {
	routes: [
		{
			method: 'GET',
			path: '/user',
			handler: 'user.exampleAction',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user',
			handler: 'user.verifyUserByEmail',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/sendmessage',
			handler: 'user.sendMailtoVerify',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/create',
			handler: 'user.createAccount',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};
