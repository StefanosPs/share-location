/**
 * Validate a password
 *
 * @param {String} password
 *
 * @returns {Array}
 */
export default function validatePassword(password) {
	const errors = [];

	if (!password) {
		errors.push(global.__getDictionary('__ERROR_EMPTY_PASSWORD__'));
	} else {
		if (password.length < 5 || password.length > 15) {
			errors.push(global.__getDictionary('__ERROR_PASSWORD_LENGTH__'));
		}

		if (password.search(/[0-9]/g) === -1) {
			errors.push(global.__getDictionary('__ERROR_PASSWORD_CONTAINS_NUM__'));
		}

		if (password.search(/[a-zA-Z]/g) === -1) {
			errors.push(global.__getDictionary('__ERROR_PASSWORD_CONTAINS_CHAR__'));
		}
	}

	return errors;
}
