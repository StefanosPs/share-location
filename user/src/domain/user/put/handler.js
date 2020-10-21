import User from '../user';
import { updateUser } from '../repository';
/**
 * The UpdateOrderHandler handler.
 *
 * Responsible... well for creating an order
 */
export default class UpdateUserHandler {
	/**
	 * Create a new UpdateUserHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({ eventBus, dB } = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a UpdateUserCommand
	 *
	 * @async
	 * @param {UpdateOrderCommand} command - the command to handle
	 * @returns {Promise<User>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const userObj = new User();

		if ('fullName' in command) userObj.fullName = command.fullName;
		if ('provider' in command) userObj.provider = command.provider;
		if ('password' in command && command.password !== '******') userObj.password = command.password;
		if ('status' in command) userObj.status = command.status;
		if ('role' in command) userObj.role = command.role;
		if ('emails' in command) userObj.emails = command.emails;

		const user = await updateUser.bind(this.dB)(command.id, userObj);

		this.eventBus.emit('UserCreated', { user });

		return { data: [{ ...user }] };
	}
}
