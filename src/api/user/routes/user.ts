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
			path: '/user/recoverypassword',
			handler: 'user.recoveryPassword',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/changepasswordcode',
			handler: 'user.changePasswordCode',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/codeverification',
			handler: 'user.codeVerification',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/phoneverification',
			handler: 'user.phoneverification',
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
		{
			method: 'POST',
			path: '/user/update',
			handler: 'user.updateUser',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/me',
			handler: 'user.getUser',
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: 'POST',
			path: '/user/creategoogle',
			handler: 'user.createAccountGoogle',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};
