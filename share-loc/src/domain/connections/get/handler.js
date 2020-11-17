import Connection from '../connection';
import { getConnection, countConnection, getUserOfConnection, getUsers } from '../repository';

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
	constructor({ eventBus, dB } = {}) {
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

		if (command.id === 'init') {
			const connectionObj = new Connection();
			connectionObj.status = 'PEDDING';
			connectionObj.watcherUserId = command.watcherUserId;

			const relationsUserIds = await getUserOfConnection.bind(this.dB)(command.watcherUserId, {});

			const [countVar, userData] = await Promise.all([
				countConnection.bind(this.dB)(),
				getUsers.bind(this.dB)({ where: { id_in: relationsUserIds } })
			]);

			return {
				data: [{ ...connectionObj }],
				relData: { user: userData },
				meta: { totalCount: countVar }
			};
		}
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

		if (command.watcherUserId) {
			params.where = { watcherUserId: command.watcherUserId };
		}
		if (command.filters) {
			params.filters = { ...command.filters };
		}

		const relationsUserIds = await getUserOfConnection.bind(this.dB)(command.watcherUserId, params);
		const [connectionArray, countVar, userData] = await Promise.all([
			getConnection.bind(this.dB)(command.id, params),
			countConnection.bind(this.dB, 0, params)(),
			getUsers.bind(this.dB)({ where: { id_in: relationsUserIds } })
		]);

		this.eventBus.emit('GetConnection', { id: command.id });

		const data = connectionArray ? [...connectionArray] : [];

		return { data, relData: { user: userData }, meta: { totalCount: countVar } };
	}
}

/**
 * @typedef {Object[]} List of the Connection
 */
