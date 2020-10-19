/**
 * Get the
 * @name Dictionary
 *
 * @param {String} lang
 */
export const initDictionary = lang => {
	const actvLang = !lang || !['en'].includes(lang.toLowerCase()) ? 'en' : lang.toLowerCase();

	// path.join(__dirname, lang, `${key}.json`);
	// TODO read dictionary of active lang
	const dictionary = actvLang
		? {
				__HELLO__: 'Hello world',
				__ERROR_WRONG_ARGUMENTS__: 'wrong arguments',
				__ERROR_WRONG_PASSWORD__: 'Incorrect password',
				__ERROR_EMPTY_ID__: 'Empty ID',
				__ERROR_INVALIDE_USER_ROLE__: 'Invalid user role',
				__ERROR_INVALIDE_USER_STATUS__: 'Invalid user status',
				__ERROR_EMPTY_USERNAME__: 'Username can not be empty',
				__ERROR_EMPTY_PASSWORD__: 'Password can not be empty',
				__ERROR_DUPLICATED_USERNAME__: 'Username must be unique',
				__ERROR_PASSWORD_LENGTH__: 'Password must be between 5 and 15 characters',
				__ERROR_PASSWORD_CONTAINS_NUM__: 'Password must contains at least one number',
				__ERROR_TROW_BIND_FAILED__: 'Failed to initialize function scope',
				__ERROR_USER_NOT_FOUND__: 'User not found',
				__ERROR_USER_USERNAME_CANNOT_CHANGE__: 'Username can not change',
				__CREATE_USER_VALIDATION_FAILED__: 'Create user validation failed',
				__GET_USER_VALIDATION_FAILED__: 'Get user validation failed',
				__UPDATE_USER_VALIDATION_FAILED__: 'Update user validation failed',
				__DELETE_USER_VALIDATION_FAILED__: 'Delete user validation failed',
				__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__: 'Login is invalid',
				__ERROR_CHECK_USENAMEPASSWORD_INACTIVE_USER_STATUS__: 'User status is inactive for login',
				__ERROR_CHECK_USENAMEPASSWORD_WRONG_PASSWORD__: 'Incorrect password'
		  }
		: {};

	return index => (index in dictionary ? dictionary[index] : index);
};

export const acceptsLanguages = () => {
	// TODO set accept langs
	return ['en'];
};
