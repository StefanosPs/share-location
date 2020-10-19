import Connection from '../connection';
import {createConnection} from '../repository';

/**
 * The CreateConnectionHandler handler.
 *
 * Responsible... well for creating an order
 */
export default class CreateConnectionHandler {
	/**
	 * Create a new CreateConnectionHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({eventBus, dB} = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a CreateConnectionCommand
	 *
	 * @async
	 * @param {CreateConnectionCommand} command - the command to handle
	 * @returns {Promise<User>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const connectionObj = new Connection();

		connectionObj.watcherUserId = command.watcherUserId;
		connectionObj.observeUserId = command.observeUserId;
		connectionObj.status = command.status;

		const resp = await createConnection.bind(this.dB)(connectionObj);

		this.eventBus.emit('CreateConnection', {connection: resp});

		return {data: [resp]};
	}
}
