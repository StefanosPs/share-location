import {userPasswordCheck} from '../repository';
import UserError from '../error';

/**
 * The CheckUserPassHandler handler.
 *
 * Responsible... well for creating an order
 */
export default class CheckUserPassCommandHandler {
	/**
	 * Create a new CheckUserPassCommandHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({eventBus, dB} = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a CheckUserPassCommand
	 *
	 * @async
	 * @param {CreateOrderCommand} command - the command to handle
	 * @returns {Promise<{check: boolean, ...user}>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		try {
			const res = await userPasswordCheck.bind(this.dB)(command.username, command.password);

			this.eventBus.emit('login ok', {username: command.username});

			return {data: [{...res}]};
		} catch (error) {
			this.eventBus.emit('login fail', {username: command.username});
			if (error instanceof UserError) {
				const errorsAr =
					UserError.errors && UserError.errors.length > 0
						? [...UserError.errors]
						: [{field: '', mesage: error.message}];
				throw new UserError(
					this,
					422,
					errorsAr,
					global.__getDictionary('__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__')
				);
			} else {
				throw error;
			}
		}
	}
}
