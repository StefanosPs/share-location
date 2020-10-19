import UserError from '../error';
import initializeGetOrder from '../initializeGetOrder';

/**
 * The command for getting the users
 */
export default class GetUserCommand {
	/**
	 * Validate this command
	 *
	 * @param dB - The dB instance
	 * @throws UserError - if the get user command is invalid
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

		if (errors.length > 0) {
			throw new UserError(
				this,
				422,
				errors,
				global.__getDictionary('__GET_USER_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a GetUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new GetUser instance
	 */
	static buildFromJSON({
		id,
		page,
		id_in: idIn,
		id_not_in: idNotIn,
		sizePerPage,
		sortField,
		sortOrder
	}) {
		const getUser = new GetUserCommand();

		if (id !== undefined) getUser.id = id;
		if (page !== undefined) getUser.page = page;
		if (sizePerPage !== undefined) getUser.sizePerPage = sizePerPage;
		if (idIn !== undefined) getUser.idIn = idIn;
		if (idNotIn !== undefined) getUser.idNotIn = idNotIn;

		getUser.order = initializeGetOrder(sortField, sortOrder);

		return getUser;
	}
}
