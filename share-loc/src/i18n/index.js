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
				__ERROR_TROW_BIND_FAILED__: 'Failed to initialize function scope',
				__ERROR_WRONG_ARGUMENTS__: 'wrong arguments',
				__ERROR_EMPTY_ID__: 'Empty ID',
				__ERROR_USER_ID__: 'User can not be empty',
				__ERROR_CONNECTION_NOT_FOUND__: 'Connection not found',
				__ERROR_WATCHER_USER_ID__: 'Watcher can not be empty',
				__ERROR_OBSERVE_USER_ID__: 'Observer can not be empty',
				__ERROR_INVALIDE_CONNECTION_STATUS__: 'Invalid user status',
				__CREATE_CONNECTION_VALIDATION_FAILED__: 'Create connection validation failed',
				__ERROR_CHECK_LOGINWACHER_DIFF__: 'Watcher must be the same with the login user',
				__ERROR_CHECK_USERIDWACHER_DIFF__: 'User ID must be the same with the login user',
				__ERROR_WATCHER_EQ_OBSERVE__: 'Watcher must be different observer',
				__GET_CONNECTION_VALIDATION_FAILED__: 'Get connection validation failed',

				__UPDATE_CONNECTION_VALIDATION_FAILED__: 'Update user validation failed',
				__ERROR_WATCHERUSERID_CANNOT_CHANGE__: 'Watcher can not change',
				__ERROR_CONNECTION_EXISTS__: 'Connection already exists',
				__DELETE_CONNECTION_VALIDATION_FAILED__: 'Delete connection validation failed',
				__GET_VALIDOBSERVER_VALIDATION_FAILED__: 'Get valid observer validation failed',
				__GET_MARK_VALIDATION_FAILED__: 'Get mark validation failed',

				__CREATE_MARK_VALIDATION_FAILED__: 'Create mark validation failed'
		  }
		: {};

	return index => (index in dictionary ? dictionary[index] : index);
};

export const acceptsLanguages = () => {
	// TODO set accept langs
	return ['en'];
};
