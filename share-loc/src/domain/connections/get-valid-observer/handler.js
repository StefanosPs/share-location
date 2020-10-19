import {getUserOfConnection, getUsers} from '../repository';

/**
 * The GetConnectionHandler handler.
 *
 * Responsible... well for getting the user data
 */
export default class GetConnectionHandler {
	/**
	 * Create a new GetConnectionHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({eventBus, dB} = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a GetConnectionCommand
	 *
	 * @async
	 * @param {GetConnectionCommand} command - the command to handle
	 * @returns {Promise<Connection[]>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const params = {};

		if (command.page) {
			params.page = command.page;
		}
		if (command.sizePerPage) {
			params.sizePerPage = command.sizePerPage;
		}
		if (command.order) {
			params.order = command.order;
		}

		params.where = {};
		const relationsUserIds = await getUserOfConnection.bind(this.dB)(command.watcherUserId);
		const notInArray = relationsUserIds ? [...relationsUserIds] : [];

		if (command.watcherUserId) {
			notInArray.push(command.watcherUserId);
		}

		if (!params.where.notIn) params.where.notIn = {};
		params.where.notIn.id = notInArray;

		const userData = await getUsers.bind(this.dB)({where: {id_not_in: relationsUserIds}});

		// console.log(userData);

		this.eventBus.emit('GetConnectionHandler', {id: command.id});

		const data = userData ? [...userData] : [];

		return {data, meta: {totalCount: userData.length}};
	}
}

/**
 * @typedef {Object[]} List of the users
 */
