import User from '../user';
import {createUser} from '../repository';

/**
 * The CreateUserHandler handler.
 *
 * Responsible... well for creating an order
 */
export default class CreateUserHandler {
	/**
	 * Create a new CreateUserHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({eventBus, dB} = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a CreateUserCommand
	 *
	 * @async
	 * @param {CreateUserCommand} command - the command to handle
	 * @returns {Promise<User>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const userObj = new User();

		userObj.username = command.username;
		userObj.password = command.password;
		userObj.fullName = command.fullName;
		userObj.role = command.role;
		userObj.status = command.status;
		userObj.emails = command.emails;
		userObj.createdAt = Date.now();

		const resp = await createUser.bind(this.dB)(userObj);

		this.eventBus.emit('UserCreated', {user: resp});

		return {data: [resp]};
	}
}
