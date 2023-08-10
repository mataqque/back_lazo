import * as yup from 'yup';
export const SchemaUser = yup.object().shape({
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().required(),
});
