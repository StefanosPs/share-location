import {deleteConnection} from '../repository';

/**
 * The DeleteUserHandler handler.
 *
 * Responsible... well for getting the user data
 */
export default class DeleteUserHandler {
	/**
	 * Create a new GetUserHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({eventBus, dB} = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a GetUserCommand
	 *
	 * @async
	 * @param {GetUserCommand} command - the command to handle
	 * @returns {Promise<User[]>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		await deleteConnection.bind(this.dB)(command.id);
		this.eventBus.emit('Delete Connection', {id: command.id});

		return {data: []};
	}
}

/**
 * @typedef {Object[]} List of the users
 */
