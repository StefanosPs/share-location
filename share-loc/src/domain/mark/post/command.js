import MarkError from '../error';
// import {connectionsStatus} from '../../constants';

// import {userExists} from '../repository';

/**
 * The command for creating users
 */
export default class CreateMarkCommand {
	/**
	 * Validate this user
	 *
	 * TODO: Add permission Check
	 *
	 * @throws UserError - if the CreateUser is invalid
	 *
	 */
	async validate() {
		const errors = [];

		if (!this.userId) {
			this.userId = this.payloadUser.key;
		}

		if (!this.userId) {
			errors.push({
				field: 'userId',
				message: global.__getDictionary('__ERROR_USER_ID__')
			});
		}

		if (this.userId !== this.payloadUser.key) {
			errors.push({
				field: 'userId',
				message: global.__getDictionary('__ERROR_CHECK_USERIDWACHER_DIFF__')
			});
		}

		if (!this.userId) {
			errors.push({ field: 'userId', message: global.__getDictionary('__ERROR_USER_ID__') });
		}

		// const connections = await getConnectionWatcherObserver.bind(dB)(
		//   this.watcherUserId,
		//   this.observeUserId
		// );

		if (errors.length > 0) {
			throw new MarkError(
				this,
				422,
				errors,
				global.__getDictionary('__CREATE_MARK_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a CreateUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new CreateUser instance
	 */
	static buildFromJSON({ payloadUser, userId, position }) {
		const createConnection = new CreateMarkCommand();

		if (payloadUser) createConnection.payloadUser = payloadUser;
		if (userId !== undefined) createConnection.userId = parseInt(userId, 10);
		if (position !== undefined) createConnection.position = position;

		return createConnection;
	}
}
