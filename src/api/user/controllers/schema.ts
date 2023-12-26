import * as Yup from 'yup';

export const credentialSchema = Yup.object().shape({
	email: Yup.string().email().required(),
	password: Yup.string().required(),
});

export const recoveryPasswordSchema = Yup.object().shape({
	email: Yup.string().email().required(),
});

export const codeVerificationSchema = Yup.object().shape({
	email: Yup.string().email().required(),
	code: Yup.string().required(),
});

export const changePasswordSchema = Yup.object().shape({
	email: Yup.string().email().required(),
	code: Yup.string().required(),
	password: Yup.string().required(),
});

export const phoneVerificationSchema = Yup.object().shape({
	// phone peru +51 900 000 000
	phone: Yup.string()
		.matches(/^51\d{9}$/, 'El formato del número debe ser +51 900 000 000')
		.required(),
});
