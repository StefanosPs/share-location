import Mark from '../mark';
import { createUpdateMark } from '../repository';

/**
 * The CreateMarkHandler handler.
 *
 * Responsible... well for creating an order
 */
export default class CreateMarkHandler {
	/**
	 * Create a new CreateConnectionHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({ eventBus, dB } = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a CreateMarkCommand
	 *
	 * @async
	 * @param {CreateMarkCommand} command - the command to handle
	 * @returns {Promise<User>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const connectionObj = new Mark();

		connectionObj.userId = command.userId;
		connectionObj.position = command.position;

		// TODO Delete and create rec
		const resp = await createUpdateMark.bind(this.dB)(connectionObj);

		this.eventBus.emit('createMark', resp);

		return { data: [resp] };
	}
}
