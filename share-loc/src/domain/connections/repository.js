// import logger from '../../logger';
import Connection from './connection';
import ConnectionError from './error';

/**
 * Return the sanitized Connection
 * @param {object} param0
 * @param {number} param0.id
 * @param {number} param0.watcherUserId
 * @param {number} param0.observeUserId
 * @param {string} param0.status
 * @returns {Connection}
 */
function sanitizedConnection({ id, watcherUserId, observeUserId, status }) {
	return new Connection({
		id,
		watcherUserId: parseInt(watcherUserId, 10),
		observeUserId: parseInt(observeUserId, 10),
		status
	});
}
/**
 * Return the sanitized User
 * @param {object} param0
 * @param {number} param0.id
 * @param {string} param0.fullName
 * @returns {object}
 */
function sanitizedUser({ id, fullName }) {
	return {
		id,
		fullName
	};
}
/**
 * Get the number of the connections
 *
 * @throws {Error}
 *
 * @param {number} id - The id of the connection
 * @returns {number}
 */
export async function countConnection(id, params) {
	if (!(this && this.countConnection)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	const cnt = await this.countConnection(id, params);
	return cnt;
}
/**
 * Create a Connection
 *
 * @throws {Error}
 * @throws {ConnectionError}
 *
 * @param {Connection} connection
 * @returns {(Connection|undefined)}
 */
export async function createConnection(connection) {
	if (!(this && this.createConnection)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!connection.watcherUserId) {
		throw new ConnectionError(
			this,
			422,
			[{ field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__') }],
			`createConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	if (!connection.observeUserId) {
		throw new ConnectionError(
			this,
			422,
			[{ field: 'observeUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__') }],
			`createConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	if (connection instanceof Connection) {
		const resConnection = await this.createConnection(
			connection.watcherUserId,
			connection.observeUserId,
			connection.status
		);

		return resConnection ? sanitizedConnection(resConnection) : undefined;
	}

	throw new ConnectionError(
		this,
		422,
		[],
		`createConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
	);
}
/**
 * Get the connections
 *
 * @param {number} id
 * @param {object} params
 *
 * @returns {(object[]|undefined)} params - List of the connection
 */
export async function getConnection(id, params = {}) {
	if (!(this && this.getConnection)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	const connectionArray = await this.getConnection(id, params);
	return connectionArray ? connectionArray.map(el => sanitizedConnection(el)) : undefined;
}
/**
 * Get a connection
 * @param {number} watcherUserId
 * @param {number} observeUserId
 *
 * @return {(object[Connection]|undefined)}
 */
export async function getConnectionWatcherObserver(watcherUserId, observeUserId) {
	if (!(this && this.getConnectionWatcherObserver)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!watcherUserId) {
		throw new ConnectionError(
			this,
			422,
			[{ field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__') }],
			`getConnectionWatcherObserver:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	if (!observeUserId) {
		throw new ConnectionError(
			this,
			422,
			[{ field: 'observeUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__') }],
			`getConnectionWatcherObserver:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	const resConnectionWatcherObserver = await this.getConnectionWatcherObserver(
		watcherUserId,
		observeUserId
	);

	return resConnectionWatcherObserver
		? resConnectionWatcherObserver.map(el => sanitizedConnection(el))
		: undefined;
}
/**
 * Get all the rel users of a user userId;
 * @param {number} watcherUserId
 * @param {object} params
 */
export async function getUserOfConnection(watcherUserId, params = {}) {
	if (!(this && this.getUserOfConnection)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!watcherUserId) {
		throw new ConnectionError(
			this,
			422,
			[{ field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__') }],
			`getUserOfConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	const userConnectionRes = await this.getUserOfConnection(watcherUserId, params);
	return userConnectionRes;
}

export async function updateConnection(id, connection) {
	if (!(this && this.updateConnection)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!id) {
		// throw new ConnectionError(null, 500, [], 'Empty ID');
		throw new ConnectionError(
			this,
			422,
			[{ field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__') }],
			`updateConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	if (connection instanceof Connection) {
		const resConnection = await this.updateConnection(id, {
			...connection
		});
		return resConnection ? sanitizedConnection(resConnection) : undefined;
	}
	throw new ConnectionError(
		this,
		422,
		[],
		`updateConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
	);
}

export async function deleteConnection(id) {
	if (!(this && this.deleteConnection)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!id) {
		throw new ConnectionError(
			this,
			422,
			[{ field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__') }],
			`deleteConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	return this.deleteConnection(id);
}

export async function getUsers(params = {}) {
	if (!(this && this.getUser)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	const resp = await this.getUser(params);

	if (resp && resp.statusCode === 200) {
		return resp.data.map(el => sanitizedUser(el));
	}
	return [];
}
