export const generateRandomNumber = (min: number, max: number): string => {
	const digits = '0123456789';
	const minLength = min;
	const maxLength = max;

	let randomString = '';
	const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * digits.length);
		randomString += digits.charAt(randomIndex);
	}

	return randomString;
};
