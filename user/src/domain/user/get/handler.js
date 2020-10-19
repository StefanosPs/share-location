import User from '../user';
import {getUser, countUsers} from '../repository';

/**
 * The GetUserHandler handler.
 *
 * Responsible... well for getting the user data
 */
export default class GetUserHandler {
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

		if (command.id === 'init') {
			const userObj = new User();
			userObj.role = 'USER';
			userObj.status = 'PEDDING';

			const [countVar] = await Promise.all([countUsers.bind(this.dB)()]);

			return {data: [{...userObj}], meta: {totalCount: countVar}};
		}
		const params = {where: {}};
		if (command.page) {
			params.page = command.page;
		}
		if (command.sizePerPage) {
			params.sizePerPage = command.sizePerPage;
		}
		if (command.order) {
			params.order = command.order;
		}
		if (command.idIn) {
			if (!params.where.in) params.where.in = {};
			params.where.in.id = command.idIn;
		}
		if (command.idNotIn) {
			if (!params.where.notIn) params.where.notIn = {};
			params.where.notIn.id = command.idNotIn;
		}

		const [userArray, countVar] = await Promise.all([
			getUser.bind(this.dB)(command.id, params),
			countUsers.bind(this.dB)()
		]);
		this.eventBus.emit('GetUser', {id: command.id});

		// console.log(' process.env.SEQUELIZE_CONNECT',  process.env.SEQUELIZE_CONNECT )
		// console.log('userArray', userArray);
		// console.log('countVar', countVar);
		if (userArray) {
			return {data: userArray, meta: {totalCount: countVar}};
		}
		return {data: [], meta: {totalCount: countVar}};
	}
}

/**
 * @typedef {Object[]} List of the users
 */
