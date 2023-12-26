import * as yup from 'yup';
export const SchemaUser = yup.object().shape({
	username: yup.string().required(),
	phone: yup.string().required(),
	email: yup.string().email().required(),
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	password: yup.string().required(),
	code: yup.string().length(6).required(),
	gender: yup.string().required(),
});

export const getSchemaUser = yup.object().shape({
	email: yup.string().email().required(),
});
export const updateUser = yup.object().shape({
	firstname: yup.string().required(),
	lastname: yup.string(),
	email: yup.string().email().required(),
	cel: yup.string(),
	gender: yup.string(),
	birthday: yup.date(),
});

export const SchemaUserGoogle = yup.object().shape({
	username: yup.string().required(),
	firstname: yup.string().required(),
	email: yup.string().email().required(),
	// role: yup.number(),
});
