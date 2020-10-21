/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
import CreateConnectionHandler from 'domain/connections/post/handler';
import GetConnectionCommand from 'domain/connections/get/handler';
import GetValidObserverCommand from 'domain/connections/get-valid-observer/handler';
import UpdateConnectionHandler from 'domain/connections/put/handler';
import DeleteConnectionHandler from 'domain/connections/delete/handler';

import CreateMarkCommand from 'domain/mark/post/handler';
import GetMarkCommand from 'domain/mark/get/handler';
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
	constructor({ registry }) {
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

		let commandHandler;
		switch (command.constructor.name) {
			case 'GetConnectionCommand':
				commandHandler = new GetConnectionCommand({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'CreateConnectionCommand':
				commandHandler = new CreateConnectionHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'UpdateConnectionCommand':
				commandHandler = new UpdateConnectionHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'DeleteConnectionCommand':
				commandHandler = new DeleteConnectionHandler({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'GetMarkCommand':
				commandHandler = new GetMarkCommand({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'CreateMarkCommand':
				commandHandler = new CreateMarkCommand({
					eventBus: this.registry.eventBus,
					dB: this.registry.dB
				});
				break;
			case 'GetValidObserverCommand':
				commandHandler = new GetValidObserverCommand({
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
			throw error;
		}
	}
}

export default CommandBus;
