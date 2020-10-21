import ConnectionError from '../error';

/**
 * The command for getting the connections
 */
export default class GetConnectionCommand {
	/**
	 * Validate this command
	 *
	 * @throws ConnectionError -
	 */
	async validate() {
		const errors = [];

		if (this.id || this.id === 0) {
			if (this.id === 'init') {
				this.id = 'init';
			} else {
				this.id = parseInt(this.id, 10);
			}
		}

		if (!this.watcherUserId) {
			if (this.payloadUser && this.payloadUser.key) {
				this.watcherUserId = this.payloadUser.key;
			} else {
				errors.push({
					field: 'watcherUserId',
					message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')
				});
			}
		}

		if (errors.length > 0) {
			throw new ConnectionError(
				this,
				422,
				errors,
				global.__getDictionary('__GET_CONNECTION_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a GetUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new GetUser instance
	 */
	static buildFromJSON({ payloadUser, id, page, sizePerPage, watcherUserId }) {
		const getGetConnection = new GetConnectionCommand();

		if (id === 'init') getGetConnection.id = 'init';
		else if (id !== undefined) getGetConnection.id = parseInt(id, 10);
		if (payloadUser) getGetConnection.payloadUser = payloadUser;
		if (watcherUserId !== undefined) getGetConnection.watcherUserId = parseInt(watcherUserId, 10);
		if (page !== undefined) getGetConnection.page = parseInt(page, 10);
		if (sizePerPage !== undefined) getGetConnection.sizePerPage = parseInt(sizePerPage, 10);

		return getGetConnection;
	}
}
