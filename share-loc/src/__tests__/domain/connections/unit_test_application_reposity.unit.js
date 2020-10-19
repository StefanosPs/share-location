/* eslint no-await-in-loop: "error" */
import {
	countConnection,
	createConnection,
	getConnection,
	getConnectionWatcherObserver,
	getUserOfConnection,
	updateConnection,
	deleteConnection,
	getUsers
} from '../../../domain/connections/repository';

// process.env.SEQUELIZE_CONNECT = global.SEQUELIZE_CONNECT;
import Connection from '../../../domain/connections/connection';
import ConnectionError from '../../../domain/connections/error';

import DBSequelize from '../../../data/sequelize';
import DBProxy from '../../../data/proxy';

const DB = {...DBSequelize, ...DBProxy};
// console.log(DB);

global.__getDictionary = index => {
	return index;
};

const connectionsAr = [];
describe('connection/repository.js', () => {
	beforeAll(async () => {
		try {
			const connections = await DB.getConnection();
			const results = [];
			for (let index = 0; index < connections.length; index += 1) {
				const el = connections[index];
				results.push(DB.deleteConnection(el.id));
			}
			await Promise.all(results);

			connectionsAr[0] = await DB.createConnection(1, 2, 'ACTIVE');
			connectionsAr[1] = await DB.createConnection(1, 3, 'ACTIVE');
			connectionsAr[2] = await DB.createConnection(1, 4, 'ACTIVE');
		} catch (error) {
			console.error(error);
			throw error;
		}
	});
	describe('countConnection', () => {
		test('should throw bind error', async () => {
			await expect(countConnection()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('should have 3 entries', async () => {
			await expect(countConnection.call(DB)).resolves.toBe(3);
		});
		test('should have 1 entries ( record exists) ', async () => {
			await expect(countConnection.call(DB, connectionsAr[0].id)).resolves.toBe(1);
		});
	});
	describe('createConnection', () => {
		test('should throw bind error', async () => {
			await expect(createConnection()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});

		test('should throw ConnectionError ', async () => {
			const connection = new Connection();
			await expect(createConnection.call(DB, connection)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[],
					`createConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});

		test('watcherUserId - observeUserId must be unique ', async () => {
			const connection = new Connection({
				watcherUserId: 1,
				observeUserId: 2,
				status: 'ACTIVE'
			});
			await expect(createConnection.call(DB, connection)).rejects.toThrowError();
		});

		test('Create connection ', async () => {
			const connection = new Connection({
				watcherUserId: 21,
				observeUserId: 1,
				status: 'ACTIVE'
			});
			const connectionResult = new Connection({
				watcherUserId: 21,
				observeUserId: 1,
				status: 'ACTIVE'
			});
			await expect(createConnection.call(DB, connection)).resolves.toMatchObject(connectionResult);
		});
	});
	describe('Read', () => {
		test('getConnection should throw bind error', async () => {
			await expect(getConnection()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('getConnection', async () => {
			const res = connectionsAr.map(el => new Connection(el));
			res.push(
				new Connection({
					watcherUserId: 21,
					observeUserId: 1,
					status: 'ACTIVE'
				})
			);
			await expect(getConnection.call(DB)).resolves.toMatchObject(res);
		});
		test('getConnectionWatcherObserver should throw bind error', async () => {
			await expect(getConnectionWatcherObserver()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});

		test('getConnectionWatcherObserver should throw ConnectionError', async () => {
			await expect(getConnectionWatcherObserver.call(DB)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')}],
					`getConnectionWatcherObserver:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});
		test('getConnectionWatcherObserver should throw ConnectionError', async () => {
			await expect(getConnectionWatcherObserver.call(DB, 1)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'observeUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__')}],
					`getConnectionWatcherObserver:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});
		test('getConnectionWatcherObserver OK', async () => {
			const res = new Connection({
				watcherUserId: 1,
				observeUserId: 2,
				status: 'ACTIVE'
			});
			await expect(getConnectionWatcherObserver.call(DB, 1, 2)).resolves.toMatchObject([res]);
		});
		test('getConnectionWatcherObserver', async () => {
			const res = connectionsAr.map(el => new Connection(el));
			res.push(
				new Connection({
					watcherUserId: 21,
					observeUserId: 1,
					status: 'ACTIVE'
				})
			);
			await expect(getConnection.call(DB)).resolves.toMatchObject(res);
		});

		// describe('getConnectionWatcherObserver', () => {
		//   test.todo('should throw bind error');
		// });
		test('getUserOfConnection should throw bind error', async () => {
			await expect(getUserOfConnection()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('getUserOfConnection should throw ConnectionError', async () => {
			await expect(getUserOfConnection.call(DB)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')}],
					`getUserOfConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});
		test('getUserOfConnection OK', async () => {
			await expect(getUserOfConnection.call(DB, 1)).resolves.toMatchObject([1, 2, 3, 4]);
		});

		test('getUserOfConnection OK', async () => {
			await expect(getUserOfConnection.call(DB, 21)).resolves.toMatchObject([21, 1]);
		});
		// describe('getUserOfConnection', () => {
		//   test.todo('should throw bind error');
		// });
	});

	describe('updateConnection', () => {
		test('should throw bind error', async () => {
			await expect(updateConnection()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});

		test('updateConnection throw ConnectionError', async () => {
			await expect(updateConnection.call(DB)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')}],
					`updateConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});

		test('updateConnection OK', async () => {
			const users = new Connection({observeUserId: 999});
			const res = new Connection({...connectionsAr[0], observeUserId: 999});
			await expect(updateConnection.call(DB, connectionsAr[0].id, users)).resolves.toMatchObject(
				res
			);
		});
	});
	describe('deleteConnection', () => {
		test('should throw bind error', async () => {
			await expect(deleteConnection()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});

		test('deleteConnection throw ConnectionError', async () => {
			await expect(deleteConnection.call(DB)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')}],
					`deleteConnection:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});

		test('deleteConnection OK', async () => {
			const res = new Connection({...connectionsAr[1]});
			await expect(deleteConnection.call(DB, connectionsAr[1].id)).resolves.toMatchObject(res);
		});
	});
	describe('getUsers', () => {
		test('should throw bind error', async () => {
			await expect(getUsers()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});

		// test('should throw error', async () => {
		//   await expect(getUsers.call(DB)).resolves.toMatchObject([]);
		// });
	});
});
