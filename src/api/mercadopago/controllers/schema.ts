import * as Yup from 'yup';

export const sellSchema = Yup.object().shape({
	users_permissions_user: Yup.string().required(),
	name: Yup.string().required(),
	email: Yup.string().required(),
	address: Yup.string().required(),
	hour: Yup.date().required(),
	date: Yup.date().required(),
	adicionaldata: Yup.string(),
});
