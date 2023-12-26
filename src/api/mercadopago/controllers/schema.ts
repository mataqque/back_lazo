import * as Yup from 'yup';
const currentDate = new Date();

// Calcula la fecha mínima permitida (2 días posteriores a la fecha actual)
const minDate = new Date(currentDate);
minDate.setDate(currentDate.getDate() - 1);
export const sellSchema = Yup.object().shape({
	full_name: Yup.string().required(),
	address: Yup.string().required(),
	date_delivery: Yup.string()
		.test('is-future-date', 'La fecha debe ser al menos 2 días posteriores a la fecha actual', value => {
			const selectedDate = new Date(value as string);
			return selectedDate >= minDate;
		})
		.required(),
	time_delivery: Yup.string().required(),
	data_additional: Yup.string(),
});
