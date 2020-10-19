import UserError from '../error';
import validatePassword from '../validatePassword';
import {roleType, userStatus} from '../../constants';
import {getUser} from '../repository';

/**
 * The command for creating users
 */
export default class UpdateUserCommand {
	/**
	 * Validate this user
	 *
	 *  TODO: Add permission Check
	 *
	 * @throws UserError - if the CreateUser is invalid
	 */
	async validate(dB) {
		const errors = [];

		if (this.id || this.id === 0) {
			this.id = parseInt(this.id, 10);
		}

		if (!this.id) {
			errors.push({field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')});
		}

		if (this.role && !roleType[this.role]) {
			if (!Object.values(roleType).includes(this.role)) {
				errors.push({
					field: 'role',
					message: global.__getDictionary('__ERROR_INVALIDE_USER_ROLE__')
				});
			} else {
				const el = Object.entries(roleType).find(([value]) => value === this.role);
				if (el) this.role = el.key;
			}
		}

		if (this.status && !userStatus[this.status]) {
			if (!Object.values(userStatus).includes(this.status)) {
				errors.push({
					field: 'status',
					message: global.__getDictionary('__ERROR_INVALIDE_USER_STATUS__')
				});
			} else {
				const el = Object.entries(userStatus).find(([value]) => value === this.status);
				if (el) this.status = el.key;
			}
		}

		const users = await getUser.bind(dB)(this.id);
		if (!users) {
			errors.push({field: 'id', message: global.__getDictionary('__ERROR_USER_NOT_FOUND__')});
		} else if (users.length > 1) {
			errors.push({field: 'id', message: global.__getDictionary('__ERROR_USER_NOT_FOUND__')});
		} else {
			const user = users[0];
			if (this.username && this.username !== user.username) {
				errors.push({
					field: 'username',
					message: global.__getDictionary('__ERROR_USER_USERNAME_CANNOT_CHANGE__')
				});
			}
		}

		if ('password' in this) {
			const tmpErrors = validatePassword(this.password);
			tmpErrors.forEach(element => {
				errors.push({field: 'password', message: element});
			});
		}

		if (errors.length > 0) {
			throw new UserError(
				this,
				422,
				errors,
				global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a UpdateUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new UpdateUser instance
	 */
	static buildFromJSON({id, username, password, fullName, role, status, emails}) {
		const updateUser = new UpdateUserCommand();

		updateUser.id = id;
		if (username !== undefined) updateUser.username = username;
		if (password !== undefined && password !== '******') updateUser.password = password;
		if (fullName !== undefined) updateUser.fullName = fullName;
		if (role !== undefined) updateUser.role = role;
		if (status !== undefined) updateUser.status = status;
		if (emails !== undefined) updateUser.emails = emails;

		return updateUser;
	}
}
