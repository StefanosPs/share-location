import {getUserByUsername} from '../repository';
import UserError from '../error';
import validatePassword from '../validatePassword';

/**
 * The command for creating a command for login validation
 */
export default class CheckUserPassCommand {
	/**
	 * Validate this request
	 *
	 * @param dB {Object} The database scope
	 * @throws UserError - if the CheckUserPassCommand is invalid
	 */
	async validate(dB) {
		const errors = [];
		if (!this.username) {
			errors.push({field: 'username', message: global.__getDictionary('__ERROR_EMPTY_USERNAME__')});
		} else {
			const user = await getUserByUsername.bind(dB)(this.username);
			if (!user) {
				errors.push({
					field: 'username',
					message: global.__getDictionary('__ERROR_USER_NOT_FOUND__')
				});
			} else if (user.status !== 'ACTIVE') {
				errors.push({
					field: 'password',
					message: global.__getDictionary('__ERROR_CHECK_USENAMEPASSWORD_INACTIVE_USER_STATUS__')
				});
			}
		}
		const tmpErrors = validatePassword(this.password);
		if (tmpErrors.length > 0) {
			// errors.push({
			//   field: 'password',
			//   message: global.__getDictionary('__ERROR_CHECK_USENAMEPASSWORD_WRONG_PASSWORD__')
			// });
			tmpErrors.forEach(element => {
				errors.push({field: 'password', message: element});
			});
		}

		if (errors.length > 0) {
			throw new UserError(
				this,
				422,
				errors,
				global.__getDictionary('__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a Check User Pass out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new CheckUserPassCommand instance
	 */
	static buildFromJSON({username, password}) {
		const login = new CheckUserPassCommand();
		login.username = username;
		login.password = password;
		return login;
	}
}
