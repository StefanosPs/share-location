import ConnectionError from '../error';

/**
 * The command for getting the connections
 */
export default class GetValidObserverCommand {
	/**
	 * Validate this command
	 *
	 * @throws ConnectionError -
	 */
	async validate() {
		const errors = [];

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

		if (this.watcherUserId !== this.payloadUser.key) {
			errors.push({
				field: 'watcherUserId',
				message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
			});
		}

		if (errors.length > 0) {
			throw new ConnectionError(
				this,
				422,
				errors,
				global.__getDictionary('__GET_VALIDOBSERVER_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a GetValidObserver out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new GetUser instance
	 */
	static buildFromJSON({ payloadUser, id, page, sizePerPage, watcherUserId }) {
		const getValidObserver = new GetValidObserverCommand();

		if (id !== undefined) getValidObserver.id = parseInt(id, 10);
		if (payloadUser) getValidObserver.payloadUser = payloadUser;
		if (watcherUserId !== undefined) getValidObserver.watcherUserId = parseInt(watcherUserId, 10);
		if (page !== undefined) getValidObserver.page = parseInt(page, 10);
		if (sizePerPage !== undefined) getValidObserver.sizePerPage = parseInt(sizePerPage, 10);

		return getValidObserver;
	}
}
