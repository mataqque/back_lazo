import * as yup from 'yup';
export const SchemaUser = yup.object().shape({
	username: yup.string().required(),
	cel: yup.string().required(),
	email: yup.string().email().required(),
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	password: yup.string().required(),
});

export const SchemaUserGoogle = yup.object().shape({
	email: yup.string().email().required(),
	firstname: yup.string().required(),
	google_id: yup.string().required(),
	role: yup.number(),
	username: yup.string().required(),
	provider: yup.string().required(),
});

// email: 'mataqque.100@gmail.com';
// id: '101601660549537569934';
// name: 'flavio mataqque pinares';
// role: 'user';
// username: 'flavio mataqque pinares';
/* `verifyuser` is a variable that stores the result of a database query to check if a user
with the given email already exists in the database. It is used to determine whether to
create a new user or return an error message indicating that the user already exists. */
