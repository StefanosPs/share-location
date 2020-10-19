import EventEmitter from 'events';

import CommandBus from '../../domain/commandBus';
import Registry from '../../domain/registry';

import DBSequelize from '../../data/sequelize';
import DBProxy from '../../data/proxy';

import CreateConnectionCommand from '../../domain/connections/post/command';
import GetConnectionCommand from '../../domain/connections/get/command';
import GetValidObserverCommand from '../../domain/connections/get-valid-observer/command';
import UpdateConnectionCommand from '../../domain/connections/put/command';
import DeleteConnectionCommand from '../../domain/connections/delete/command';
import CreateMarkCommand from '../../domain/mark/post/command';
import GetMarkCommand from '../../domain/mark/get/command';

import ConnectionError from '../../domain/connections/error';
import MarkError from '../../domain/mark/error';

const DB = {...DBSequelize, ...DBProxy};

global.__getDictionary = index => {
	return index;
};

const connectionsAr = [];
const markAr = [];
let commandBus;
describe('commandBus', () => {
	beforeAll(async () => {
		commandBus = new CommandBus({
			registry: new Registry({
				eventBus: new EventEmitter(),
				dB: DB
			})
		});
		expect(process.env.SEQUELIZE_CONNECT).toContain('test');
		try {
			const connections = await DB.getConnection();
			const marks = await DB.getMark();
			const results = [];
			for (let index = 0; index < connections.length; index += 1) {
				const el = connections[index];
				results.push(DB.deleteConnection(el.id));
			}
			for (let index = 0; index < marks.length; index += 1) {
				const el = marks[index];
				results.push(DB.deleteMark(el.userId));
			}

			await Promise.all(results);

			connectionsAr[0] = await DB.createConnection(1, 2, 'ACTIVE');
			connectionsAr[1] = await DB.createConnection(1, 3, 'ACTIVE');
			connectionsAr[2] = await DB.createConnection(1, 4, 'ACTIVE');

			markAr[0] = await DB.createUpdateMark(1, {lat: 37.9838, lng: 23.7275});
			markAr[1] = await DB.createUpdateMark(2, {lat: 38.9838, lng: 24.7275});
			markAr[2] = await DB.createUpdateMark(3, {lat: 37.9999, lng: 23.7999});
		} catch (error) {
			console.error(error);
			throw error;
		}
	});

	describe('CreateConnectionCommand', () => {
		test('Create a connection fail', async () => {
			const connectionObj = {
				payloadUser: {},
				watcherUserId: undefined,
				observeUserId: undefined,
				status: undefined
			};
			const command = CreateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')},
						{
							field: 'watcherUserId',
							message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
						},
						{field: 'observeUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__')}
					],
					global.__getDictionary('__CREATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a connection fail logind in != watcher', async () => {
			const connectionObj = {
				payloadUser: {key: 10},
				watcherUserId: 1,
				observeUserId: 99,
				status: 'ACTIVE'
			};
			const command = CreateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{
							field: 'watcherUserId',
							message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
						}
					],
					global.__getDictionary('__CREATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a connection fail empty observeUserId', async () => {
			const connectionObj00 = {
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 0,
				status: 'ACTIVE'
			};
			const command00 = CreateConnectionCommand.buildFromJSON(connectionObj00);
			await expect(commandBus.execute(command00)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'watcherUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__')}],
					global.__getDictionary('__CREATE_CONNECTION_VALIDATION_FAILED__')
				)
			);

			const connectionObj01 = {
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: undefined,
				status: 'ACTIVE'
			};
			const command01 = CreateConnectionCommand.buildFromJSON(connectionObj01);
			await expect(commandBus.execute(command01)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'watcherUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__')}],
					global.__getDictionary('__CREATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a connection fail connection exist', async () => {
			const connectionObj = {
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 2,
				status: 'ACTIVE'
			};
			const command = CreateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{field: 'watcherUserId', message: global.__getDictionary('__ERROR_CONNECTION_EXISTS__')}
					],
					global.__getDictionary('__CREATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a connection ok', async () => {
			const connectionObj = {
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 10,
				status: 'ACTIVE'
			};

			const connectionObjRes = {
				data: [
					{
						watcherUserId: 1,
						observeUserId: 10,
						status: 'ACTIVE'
					}
				]
			};
			const command = CreateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).resolves.toMatchObject(connectionObjRes);
		});
	});
	describe('GetConnectionCommand', () => {
		test('Get All ', async () => {
			const command = GetConnectionCommand.buildFromJSON({
				sizePerPage: 99999,
				payloadUser: {key: 1}
			});

			const {data, meta} = await commandBus.execute(command);
			expect(data.length).toEqual(meta.totalCount);
			expect(data.length).toEqual(4);
		});
		test('Get One ', async () => {
			const {id} = connectionsAr[0];
			const command = GetConnectionCommand.buildFromJSON({id, payloadUser: {key: 1}});

			const {data, meta} = await commandBus.execute(command);
			expect(data.length).not.toEqual(meta.totalCount);
			expect(data.length).toEqual(1);
		});
		test('Get init ', async () => {
			const command = GetConnectionCommand.buildFromJSON({id: 'init', payloadUser: {key: 1}});
			const {data} = await commandBus.execute(command);
			expect(data).toEqual([{status: 'PEDDING', watcherUserId: 1}]);
		});
		test.todo('change sort');
		test.todo('change page size');
	});

	describe('GetValidObserverCommand', () => {
		test('GetValidObserverCommand a connection fail', async () => {
			const connectionObj = {
				payloadUser: {},
				watcherUserId: undefined,
				status: undefined
			};
			const command = GetValidObserverCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')},
						{
							field: 'watcherUserId',
							message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
						},
						{field: 'observeUserId', message: global.__getDictionary('__ERROR_OBSERVE_USER_ID__')}
					],
					global.__getDictionary('__GET_VALIDOBSERVER_VALIDATION_FAILED__')
				)
			);
		});

		test('GetValidObserverCommand fail logind in != watcher', async () => {
			const connectionObj = {
				payloadUser: {key: 10},
				watcherUserId: 1,
				status: 'ACTIVE'
			};
			const command = GetValidObserverCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{
							field: 'watcherUserId',
							message: global.__getDictionary('__ERROR_CHECK_LOGINWACHER_DIFF__')
						}
					],
					global.__getDictionary('__GET_VALIDOBSERVER_VALIDATION_FAILED__')
				)
			);
		});

		// test('should throw error', async () => {
		//   await expect(getUsers.call(DB)).resolves.toMatchObject([]);
		// });
	});

	describe('UpdateConnectionCommand', () => {
		test('Update user not fount ', async () => {
			const command = UpdateConnectionCommand.buildFromJSON({id: 0});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')}],
					global.__getDictionary('__UPDATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Update invalid status ', async () => {
			const connectionObj = {
				id: connectionsAr[0].id,
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 99,
				status: 'lalalala'
			};
			const command = UpdateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{
							field: 'status',
							message: global.__getDictionary('__ERROR_INVALIDE_CONNECTION_STATUS__')
						}
					],
					global.__getDictionary('__UPDATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Update invalid id ', async () => {
			const connectionObj = {
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 4,
				status: 'Pedding'
			};
			const command = UpdateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{
							field: 'status',
							message: global.__getDictionary('__ERROR_CONNECTION_NOT_FOUND__')
						}
					],
					global.__getDictionary('__UPDATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Update  __ERROR_CONNECTION_EXISTS__', async () => {
			const connectionObj = {
				id: connectionsAr[0].id,
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 4,
				status: 'Pedding'
			};
			const command = UpdateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[
						{
							field: 'status',
							message: global.__getDictionary('__ERROR_CONNECTION_NOT_FOUND__')
						}
					],
					global.__getDictionary('__UPDATE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Update  ok', async () => {
			const connectionObj = {
				id: connectionsAr[0].id,
				payloadUser: {key: 1},
				watcherUserId: 1,
				observeUserId: 99,
				status: 'Pedding'
			};

			const connectionObjRes = {
				data: [
					{
						id: connectionsAr[0].id,
						watcherUserId: 1,
						observeUserId: 99,
						status: 'Pedding'
					}
				]
			};
			const command = UpdateConnectionCommand.buildFromJSON(connectionObj);
			await expect(commandBus.execute(command)).resolves.toMatchObject(connectionObjRes);
		});
	});
	describe('DeleteConnectionCommand', () => {
		test('Delete check user not fount', async () => {
			const command = DeleteConnectionCommand.buildFromJSON({id: undefined});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')}],
					global.__getDictionary('__DELETE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Delete check user not fount', async () => {
			const command = DeleteConnectionCommand.buildFromJSON({id: -1});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new ConnectionError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')}],
					global.__getDictionary('__DELETE_CONNECTION_VALIDATION_FAILED__')
				)
			);
		});

		test('Delete ok', async () => {
			const connectionObjRes = {data: []};
			const command = DeleteConnectionCommand.buildFromJSON({id: connectionsAr[0].id});
			await expect(commandBus.execute(command)).resolves.toMatchObject(connectionObjRes);
		});
	});
	describe('CreateMarkCommand', () => {
		test('Create a mark fail', async () => {
			const markObj = {
				payloadUser: {},
				userId: undefined,
				position: undefined
			};
			const command = CreateMarkCommand.buildFromJSON(markObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new MarkError(
					this,
					422,
					[{field: 'watcherUserId', message: global.__getDictionary('__ERROR_WATCHER_USER_ID__')}],
					global.__getDictionary('__CREATE_MARK_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a mark logind in != watcher', async () => {
			const markObj = {
				payloadUser: {},
				userId: 10,
				position: undefined
			};
			const command = CreateMarkCommand.buildFromJSON(markObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new MarkError(
					this,
					422,
					[
						{
							field: 'watcherUserId',
							message: global.__getDictionary('__ERROR_CHECK_USERIDWACHER_DIFF__')
						}
					],
					global.__getDictionary('__CREATE_MARK_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a mark logind in != watcher', async () => {
			const markObj = {
				payloadUser: {key: 15},
				userId: 10,
				position: undefined
			};

			const command = CreateMarkCommand.buildFromJSON(markObj);
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new MarkError(
					this,
					422,
					[
						{
							field: 'watcherUserId',
							message: global.__getDictionary('__ERROR_CHECK_USERIDWACHER_DIFF__')
						}
					],
					global.__getDictionary('__CREATE_MARK_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a mark ok', async () => {
			const markObj = {
				payloadUser: {key: 10},
				userId: 10,
				position: 111
			};

			const markObjRes = {
				data: [
					{
						userId: 10,
						position: 111
					}
				]
			};
			const command = CreateMarkCommand.buildFromJSON(markObj);
			await expect(commandBus.execute(command)).resolves.toMatchObject(markObjRes);
		});
	});
	describe('GetMarkCommand', () => {
		test('Get All ', async () => {
			const command = GetMarkCommand.buildFromJSON({
				sizePerPage: 99999,
				payloadUser: {key: 1}
			});

			const {data, meta} = await commandBus.execute(command);
			expect(data.length).not.toEqual(meta.totalCount);
			expect(data.length).toEqual(3);
		});
		test('Get One ', async () => {
			const {userId} = markAr[0];
			const command = GetMarkCommand.buildFromJSON({id: userId, payloadUser: {key: 1}});
			const {data, meta} = await commandBus.execute(command);
			expect(data.length).not.toEqual(meta.totalCount);
			expect(data.length).toEqual(1);
		});

		test.todo('change sort');
		test.todo('change page size');
	});
});
