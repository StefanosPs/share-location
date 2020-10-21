import MarkError from '../error';

/**
 * The command for getting the marks
 */
export default class GetMarkCommand {
	/**
	 * Validate this command
	 *
	 * @throws MarkError -
	 */
	async validate() {
		const errors = [];

		if (!this.watcherUserId) {
			this.watcherUserId = this.payloadUser.key;
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

		if (errors.length > 0) {
			throw new MarkError(
				this,
				422,
				errors,
				global.__getDictionary('__GET_MARK_VALIDATION_FAILED__')
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
		const getMarkCommand = new GetMarkCommand();

		if (id === 'init') getMarkCommand.id = 'init';
		else if (id !== undefined) getMarkCommand.id = parseInt(id, 10);
		if (payloadUser) getMarkCommand.payloadUser = payloadUser;
		if (watcherUserId !== undefined) getMarkCommand.watcherUserId = Number(watcherUserId);

		if (page !== undefined) getMarkCommand.page = page;
		if (sizePerPage !== undefined) getMarkCommand.sizePerPage = sizePerPage;

		return getMarkCommand;
	}
}
