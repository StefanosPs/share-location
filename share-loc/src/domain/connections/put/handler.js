import Connection from '../connection';
import { updateConnection } from '../repository';

export default class UpdateConnectionHandler {
	/**
	 * Create a new UpdateConnectionHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({ eventBus, dB } = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a UpdateConnectionCommand
	 *
	 * @async
	 * @param {UpdateOrderCommand} command - the command to handle
	 * @returns {Promise<User>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const connectionObj = new Connection();

		if ('watcherUserId' in command) connectionObj.watcherUserId = command.watcherUserId;
		if ('observeUserId' in command) connectionObj.observeUserId = command.observeUserId;
		if ('status' in command) connectionObj.status = command.status;

		const connection = await updateConnection.bind(this.dB)(command.id, connectionObj);

		this.eventBus.emit('UpdateConnection', { connection });

		return { data: [connection] };
	}
}
