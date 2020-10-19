// import Mark from '../mark';
import {getMark, countMark} from '../repository';
import {getUserOfConnection, getUsers} from '../../connections/repository';
/**
 * The GetMarkHandler handler.
 *
 * Responsible... well for getting the user data
 */
export default class GetMarkHandler {
	/**
	 * Create a new GetMarkHandler
	 *
	 * @param {object} params
	 * @param {EventEmitter} params.eventBus - the bus to emit any events on
	 */
	constructor({eventBus, dB} = {}) {
		this.eventBus = eventBus;
		this.dB = dB;
	}

	/**
	 * Handle a GetMarkCommand
	 *
	 * @async
	 * @param {GetMarkCommand} command - the command to handle
	 * @returns {Promise<Connection[]>} - a promise that resolves with an User
	 */
	async handle(command) {
		await command.validate(this.dB);

		const params = {};
		let users;
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
			users = await getUserOfConnection.bind(this.dB)(command.watcherUserId);
			if (users && Array.isArray(users)) {
				params.where = {userId: [...users, command.watcherUserId]};
			}
		}

		const [markArray, countVar] = await Promise.all([
			getMark.bind(this.dB)(command.id, params),
			countMark.bind(this.dB)()
		]);

		const relationsUserIds = markArray.map(el => {
			if (el && el.userId) return el.userId;

			return false;
		});

		const userData = await getUsers.bind(this.dB)({where: {id_in: relationsUserIds}});

		this.eventBus.emit('GetMark', {id: command.id});
		if (markArray) {
			return {data: markArray, relData: {user: userData}, meta: {totalCount: countVar}};
		}
		return {data: [], meta: {totalCount: countVar}};
	}
}
