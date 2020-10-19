import ConnectionError from '../error';
import {connectionsStatus} from '../../constants';

import {getConnection, getConnectionWatcherObserver} from '../repository';

/**
 * The command for creating users
 */
export default class UpdateConnectionCommand {
	/**
	 * Validate this user
	 *
	 * TODO: Add permission Check
	 *
	 * @throws ConnectionError - if the CreateUser is invalid
	 */
	async validate(dB) {
		const errors = [];

		if (this.id || this.id === 0) {
			this.id = parseInt(this.id, 10);
		}

		if (!this.id) {
			errors.push({field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')});
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

		const connections = await getConnection.bind(dB)(this.id);
		if (!connections) {
			errors.push({field: 'id', message: global.__getDictionary('__ERROR_CONNECTION_NOT_FOUND__')});
		} else if (connections.length > 1) {
			errors.push({field: 'id', message: global.__getDictionary('__ERROR_CONNECTION_NOT_FOUND__')});
		} else {
			const connection = connections[0];
			if (this.watcherUserId && this.watcherUserId !== connection.watcherUserId) {
				errors.push({
					field: 'watcherUserId',
					message: global.__getDictionary('__ERROR_WATCHERUSERID_CANNOT_CHANGE__')
				});
			}
			if (connection.watcherUserId !== this.payloadUser.key) {
				errors.push({
					field: 'watcherUserId',
					message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
				});
			}

			if (this.observeUserId && connection.observeUserId !== this.observeUserId) {
				const connectionsExist = await getConnectionWatcherObserver.bind(dB)(
					connection.watcherUserId,
					this.observeUserId
				);
				const connectionExist = connectionsExist[0];
				if (connectionExist && connectionExist.id > 0) {
					errors.push({
						field: 'observeUserId',
						message: global.__getDictionary('__ERROR_CONNECTION_EXISTS__')
					});
				}
			}
		}

		if (errors.length > 0) {
			throw new ConnectionError(
				this,
				422,
				errors,
				global.__getDictionary('__UPDATE_CONNECTION_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a CreateUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new CreateUser instance
	 */
	static buildFromJSON({payloadUser, id, watcherUserId, observeUserId, status}) {
		const updateConnection = new UpdateConnectionCommand();

		updateConnection.id = id;
		if (payloadUser) updateConnection.payloadUser = payloadUser;
		if (watcherUserId !== undefined) updateConnection.watcherUserId = parseInt(watcherUserId, 10);
		if (observeUserId !== undefined) updateConnection.observeUserId = parseInt(observeUserId, 10);
		if (status !== undefined) updateConnection.status = status;

		return updateConnection;
	}
}
