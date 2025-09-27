export function isEmail(email) {
	return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

export function isPhone(phone) {
	return /^\d{10}$/.test(phone);
}


export function isRequired(val) {
	return val !== undefined && val !== null && val !== '';
}

// Generic validate function for login form
export function validate(values) {
	const errors = {};
	if (!isEmail(values.email)) {
		errors.email = 'Invalid email address';
	}
	if (!isRequired(values.email)) {
		errors.email = 'Email is required';
	}
	if (!isRequired(values.password)) {
		errors.password = 'Password is required';
	}
	return errors;
}
