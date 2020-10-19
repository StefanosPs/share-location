import UserError from '../error';
import validatePassword from '../validatePassword';
import {getUserByUsername} from '../repository';
import {roleType, userStatus} from '../../constants';

/**
 * The command for creating users
 */
export default class CreateUserCommand {
	/**
	 * Validate this user
	 *
	 * TODO: Add permission Check
	 *
	 * @throws UserError - if the CreateUser is invalid
	 */
	async validate(dB) {
		const errors = [];

		if (!this.role) {
			this.role = 'USER';
		}

		if (!this.status) {
			this.status = 'PEDDING';
		}

		if (!roleType[this.role]) {
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

		if (!userStatus[this.status]) {
			if (!Object.values(userStatus).includes(this.status)) {
				errors.push({
					field: 'status',
					message: global.__getDictionary('__ERROR_INVALIDE_USER_ROLE__')
				});
			} else {
				const el = Object.entries(userStatus).find(([value]) => value === this.status);
				if (el) this.status = el.key;
			}
		}

		if (!this.username) {
			errors.push({
				field: 'username',
				message: global.__getDictionary('__ERROR_INVALIDE_USER_STATUS__')
			});
		} else {
			const user = await getUserByUsername.bind(dB)(this.username);
			if (user) {
				errors.push({
					field: 'username',
					message: global.__getDictionary('__ERROR_DUPLICATED_USERNAME__')
				});
			}
		}

		const tmpErrors = validatePassword(this.password);
		tmpErrors.forEach(element => {
			errors.push({field: 'password', message: element});
		});

		if (errors.length > 0) {
			throw new UserError(
				this,
				422,
				errors,
				global.__getDictionary('__CREATE_USER_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a CreateUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new CreateUser instance
	 */
	static buildFromJSON({username, password, fullName, role, status, emails}) {
		const createUser = new CreateUserCommand();

		if (username !== undefined) createUser.username = username;
		if (password !== undefined && password !== '******') createUser.password = password;
		if (fullName !== undefined) createUser.fullName = fullName;
		if (role !== undefined) createUser.role = role;
		if (status !== undefined) createUser.status = status;
		if (emails !== undefined) createUser.emails = emails;

		return createUser;
	}
}
