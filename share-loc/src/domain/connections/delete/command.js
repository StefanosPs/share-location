import { countConnection } from '../repository';
import ConnectionError from '../error';

/**
 * The command for deleting the connections
 */
export default class DeleteConnectionCommand {
	/**
	 * Validate this command
	 *
	 * @throws ConnectionError - if the get user command is invalid
	 */
	async validate(dB) {
		const errors = [];

		if (this.id || this.id === 0) {
			this.id = parseInt(this.id, 10);
		}

		if (!this.id) {
			errors.push({
				field: 'id',
				message: global.__getDictionary('__ERROR_CONNECTION_NOT_FOUND__')
			});
		}

		const userExist = await countConnection.bind(dB)(this.id);
		if (!userExist) {
			errors.push({
				field: 'id',
				message: global.__getDictionary('__ERROR_CONNECTION_NOT_FOUND__')
			});
		}

		if (errors.length > 0) {
			throw new ConnectionError(
				this,
				422,
				errors,
				global.__getDictionary('__DELETE_CONNECTION_VALIDATION_FAILED__')
			);
		}
	}

	/**
	 * Build a DeleteUser out of the given JSON payload
	 *
	 * @param {object} json - the JSON to build from
	 * @returns a new DeleteUser instance
	 */
	static buildFromJSON({ id }) {
		const deleteUser = new DeleteConnectionCommand();

		if (id !== undefined) deleteUser.id = parseInt(id, 10);
		return deleteUser;
	}
}
