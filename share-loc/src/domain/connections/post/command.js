import ConnectionError from '../error';
import { connectionsStatus } from '../../constants';

import { getConnectionWatcherObserver } from '../repository';

/**
 * The command for creating users
 */
export default class CreateConnectionCommand {
	/**
	 * Validate this user
	 *
	 * TODO: Add permission Check
	 *
	 * @throws UserError - if the CreateUser is invalid
	 */
	async validate(dB) {
		const errors = [];

		if (!this.status) {
			this.status = 'PEDDING';
		}

		if (this.status && !connectionsStatus[this.status]) {
			if (!Object.values(connectionsStatus).includes(this.status)) {
				errors.push({
					field: 'status',
					message: global.__getDictionary('__ERROR_INVALIDE_CONNECTION_STATUS__')
				});
			} else {
				const el = Object.entries(connectionsStatus).find(([value]) => value === this.status);
				if (el) this.status = el;
			}
		}

		if (!this.watcherUserId) {
			errors.push({
				field: 'watcherUserId',
				message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')
			});
		}
		if (this.watcherUserId !== this.payloadUser.key) {
			errors.push({
				field: 'watcherUserId',
				message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
			});
		}

		if (!this.observeUserId) {
			errors.push({
				field: 'observeUserId',
				message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__')
			});
		}

		if (this.watcherUserId === this.observeUserId) {
			errors.push({
				field: 'observeUserId',
				message: global.__getDictionary('__ERROR_WATCHER_EQ_OBSERVE__')
			});
		}

		if (errors.length < 1) {
			const connections = await getConnectionWatcherObserver.bind(dB)(
				this.watcherUserId,
				this.observeUserId
			);
			const connection = connections[0];
			if (connection && connection.id > 0) {
				errors.push({
					field: 'observeUserId',
					message: global.__getDictionary('__ERROR_CONNECTION_EXISTS__')
				});
			}
		}

		if (errors.length > 0) {
			throw new ConnectionError(
				this,
				422,
				errors,
				global.__getDictionary('__CREATE_CONNECTION_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a CreateUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new CreateUser instance
	 */
	static buildFromJSON({ payloadUser, watcherUserId, observeUserId, status }) {
		const createConnection = new CreateConnectionCommand();

		if (payloadUser) createConnection.payloadUser = payloadUser;
		if (watcherUserId !== undefined) createConnection.watcherUserId = parseInt(watcherUserId, 10);
		if (observeUserId !== undefined) createConnection.observeUserId = parseInt(observeUserId, 10);
		if (status !== undefined) createConnection.status = status;

		return createConnection;
	}
}
