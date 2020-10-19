/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import CreateUserHandler from 'domain/user/post/handler';
import GetUserHandler from 'domain/user/get/handler';
import UpdateUserHandler from 'domain/user/put/handler';
import DeleteUserHandler from 'domain/user/delete/handler';

import CheckUserPassCommandHandler from 'domain/user/check-user-pass/handler';
import logger from '../logger';

/**
 * A command bus/dispather.
 *
 * Commands in this context are synonyms of "Use Cases"
 * from CLEAN architecture.
 *
 * You can consider this dispatcher as the only gateway
 * through which the driver adapters drive our domain
 * (in hexagonal architecture lingo).
 */
class CommandBus {
	/**
	 * Create a new CommandBus instance
	 *
	 * @param {Object} options
	 * @param {Registry} options.registry - a registry of dependencies
	 * to inject to resolved handlers.
	 */
	constructor({registry}) {
		this.registry = registry;
	}

	/**
	 * Execute the given command using its designated hander,
	 * and return a Promise.
	 *
	 * @param {Object} command - the command to execute
	 * @returns {Promise} a promise that resolves if the command
	 * executes successfully and rejects if it fails
	 * @throws if no handler is found for the given command
	 */
	async execute(command) {
		if (!command) {
			throw new Error('CommandBus: execute expects a command');
		}
		// console.log('command.constructor.name', command.constructor.name);
		let commandHandler;
		switch (command.constructor.name) {
			case 'CreateUserCommand':
				commandHandler = new CreateUserHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'GetUserCommand':
				commandHandler = new GetUserHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'UpdateUserCommand':
				commandHandler = new UpdateUserHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'DeleteUserCommand':
				commandHandler = new DeleteUserHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'CheckUserPassCommand':
				commandHandler = new CheckUserPassCommandHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			default:
				logger.error(`CommandBus: No handler found for command "${command.constructor.name}"`);
				throw new Error(`CommandBus: No handler found for command "${command.constructor.name}"`);
		}

		try {
			return await commandHandler.handle(command);
		} catch (error) {
			logger.error(error);
		}
	}
}

export default CommandBus;
