/* eslint no-await-in-loop: "error" */
import EventEmitter from 'events';

import CommandBus from '../../domain/commandBus';
import Registry from '../../domain/registry';

import DB from '../../data/sequelize/index';

import CreateUserCommand from '../../domain/user/post/command';
import GetUserCommand from '../../domain/user/get/command';
import UpdateUserCommand from '../../domain/user/put/command';
import DeleteUserCommand from '../../domain/user/delete/command';

import CheckUserPassCommand from '../../domain/user/check-user-pass/command';

import UserError from '../../domain/user/error';

global.__getDictionary = index => {
	return index;
};
const recordsAr = [];
let commandBus;
describe('commandBus', () => {
	beforeAll(async () => {
		// console.log('00');
		commandBus = new CommandBus({
			registry: new Registry({
				eventBus: new EventEmitter(),
				dB: DB
			})
		});

		expect(process.env.SEQUELIZE_CONNECT).toContain('test');

		// console.log('02');
		try {
			const users = await DB.getUser();

			const results = [];
			for (let index = 0; index < users.length; index += 1) {
				const el = users[index];
				// console.log(el)
				results.push(DB.deleteUser(el.id));
			}
			// console.log('Delete');
			await Promise.all(results);

			recordsAr[0] = await DB.createUser(
				'full name 1',
				'username1',
				'password',
				'USER',
				'ACTIVE',
				'',
				['mail01@gmail.com', 'mail02@gmail.com']
			);
			recordsAr[1] = await DB.createUser(
				'full name 2',
				'username2',
				'password',
				'USER',
				'ACTIVE',
				'',
				['mail01@gmail.com', 'mail02@gmail.com']
			);
			recordsAr[2] = await DB.createUser(
				'full name 3',
				'username3',
				'password',
				'USER',
				'ACTIVE',
				'',
				['mail01@gmail.com', 'mail02@gmail.com']
			);
			console.log('create');
		} catch (e) {
			console.error(e);
			throw e;
		}
	});

	describe('CreateUserCommand', () => {
		const userObj = {
			username: '',
			password: 'password',
			fullName: 'Fullname',
			role: '',
			status: '',
			emails: ['email@ttt.gr']
		};
		test('Create a user fail empty username ', async () => {
			const command = CreateUserCommand.buildFromJSON(userObj);
			// try {
			//   await commandBus.execute(command);
			// } catch (error) {
			//   console.error(error);
			// }

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'username', message: global.__getDictionary('__ERROR_EMPTY_USERNAME__')}],
					global.__getDictionary('__CREATE_USER_VALIDATION_FAILED__')
				)
			);
			userObj.username = 'user1';
		});

		test('Create a user fail must contain number ', async () => {
			const command = CreateUserCommand.buildFromJSON(userObj);

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'password', message: global.__getDictionary('__ERROR_PASSWORD_CONTAINS_NUM__')}],
					global.__getDictionary('__CREATE_USER_VALIDATION_FAILED__')
				)
			);
			userObj.password = 'p2ssword';
		});

		test('Create a user fail invalid role ', async () => {
			const command = CreateUserCommand.buildFromJSON({...userObj, role: 'ABC'});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'role', message: global.__getDictionary('__ERROR_INVALIDE_USER_ROLE__')}],
					global.__getDictionary('__CREATE_USER_VALIDATION_FAILED__')
				)
			);
		});
		test('Create a user fail invalid status ', async () => {
			const command = CreateUserCommand.buildFromJSON({...userObj, status: 'ABC'});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'role', message: global.__getDictionary('__ERROR_INVALIDE_USER_STATUS__')}],
					global.__getDictionary('__CREATE_USER_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a user OK ', async () => {
			const userResult = {
				data: [
					{
						username: 'user1',
						password: '******',
						fullName: 'Fullname',
						role: 'USER',
						status: 'PEDDING',
						emails: ['email@ttt.gr']
					}
				]
			};
			const command = CreateUserCommand.buildFromJSON(userObj);

			await expect(commandBus.execute(command)).resolves.toMatchObject(userResult);
		});
		test('Create a user fail duplicate ', async () => {
			const command = CreateUserCommand.buildFromJSON(userObj);

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'username', message: global.__getDictionary('__ERROR_DUPLICATED_USERNAME__')}],
					global.__getDictionary('__CREATE_USER_VALIDATION_FAILED__')
				)
			);
		});

		test('Create a user OK ', async () => {
			const user = {
				username: 'user2',
				password: 'p2ssword',
				fullName: 'Fullname',
				role: 'USER',
				status: 'ACTIVE',
				emails: ['email@ttt.gr']
			};
			const userResult = {
				data: [
					{
						username: 'user2',
						password: '******',
						fullName: 'Fullname',
						role: 'USER',
						status: 'ACTIVE',
						emails: ['email@ttt.gr']
					}
				]
			};
			const command = CreateUserCommand.buildFromJSON(user);

			await expect(commandBus.execute(command)).resolves.toMatchObject(userResult);
		});
	});
	describe('GetUserCommand', () => {
		// const userObj = {
		//   id: undefined,
		//   page: undefined,
		//   id_in: undefined,
		//   sizePerPage: undefined,
		//   sortField: undefined,
		//   sortOrder: undefined
		// };

		test('Get All ', async () => {
			const command = GetUserCommand.buildFromJSON({sizePerPage: 99999});

			const {data, meta} = await commandBus.execute(command);
			expect(data.length).toEqual(meta.totalCount);
			expect(data.length).toEqual(5);
		});

		test('Get One ', async () => {
			const {id} = recordsAr[0];
			const command = GetUserCommand.buildFromJSON({id});

			const {data, meta} = await commandBus.execute(command);
			expect(data.length).not.toEqual(meta.totalCount);
			expect(data.length).toEqual(1);
		});
		test('Get init ', async () => {
			const command = GetUserCommand.buildFromJSON({id: 'init'});
			const {data} = await commandBus.execute(command);
			expect(data).toEqual([{role: 'USER', status: 'PEDDING'}]);
		});
		test.todo('change sort');
		test.todo('change page size');
	});
	describe('UpdateUserCommand', () => {
		// const userObj = {
		//   id: undefined,
		//   username: undefined,
		//   password: undefined,
		//   fullName: undefined,
		//   role: undefined,
		//   status: undefined,
		//   emails: undefined
		// };

		// UpdateUserCommand.buildFromJSON({id, username, password, fullName, role, status, emails})
		test('Update user not fount ', async () => {
			const command = UpdateUserCommand.buildFromJSON({id: 0});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_EMPTY_ID__')}],
					global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__')
				)
			);
		});
		test('Update invalid role ', async () => {
			const {id} = recordsAr[0];
			const command = UpdateUserCommand.buildFromJSON({id, role: 'ABC'});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'role', message: global.__getDictionary('__ERROR_INVALIDE_USER_ROLE__')}],
					global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__')
				)
			);
		});
		test('Update invalid status ', async () => {
			const {id} = recordsAr[0];
			const command = UpdateUserCommand.buildFromJSON({id, status: 'ABC'});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'status', message: global.__getDictionary('__ERROR_INVALIDE_USER_ROLE__')}],
					global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__')
				)
			);
		});
		test('Update user not fount @ DB ', async () => {
			const command = UpdateUserCommand.buildFromJSON({id: -10});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'id', message: global.__getDictionary('__ERROR_USER_NOT_FOUND__')}],
					global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__')
				)
			);
		});
		test('Update username can not be change ', async () => {
			const {id} = recordsAr[0];
			const command = UpdateUserCommand.buildFromJSON({id, username: 'username155'});

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[
						{
							field: 'password',
							message: global.__getDictionary('__ERROR_USER_USERNAME_CANNOT_CHANGE__')
						}
					],
					global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__')
				)
			);
		});

		test('Update invalid new password', async () => {
			const {id} = recordsAr[0];
			const command = UpdateUserCommand.buildFromJSON({id, password: 'password'});

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(this, 422, [], global.__getDictionary('__UPDATE_USER_VALIDATION_FAILED__'))
			);
		});

		test('Update user status', async () => {
			const {id} = recordsAr[0];
			const command = UpdateUserCommand.buildFromJSON({id, status: 'ACTIVE'});
			commandBus.execute(command);
			delete recordsAr[0].provider;
			const {data} = await commandBus.execute(command);
			expect(data).toEqual([{...recordsAr[0], role: 'USER', status: 'ACTIVE', password: '******'}]);
		});
	});
	describe('DeleteUserCommand', () => {
		// const userObj = {
		//   id: undefined
		// };

		test('Delete check user not fount', async () => {
			const command = DeleteUserCommand.buildFromJSON({id: undefined});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(this, 422, [], global.__getDictionary('__DELETE_USER_VALIDATION_FAILED__'))
			);
		});

		test('check user not fount @ DB', async () => {
			const command = DeleteUserCommand.buildFromJSON({id: -10});
			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(this, 422, [], global.__getDictionary('__DELETE_USER_VALIDATION_FAILED__'))
			);
		});

		test('Delete  user OK', async () => {
			const {id} = recordsAr[0];
			const command = DeleteUserCommand.buildFromJSON({id});
			const {data} = await commandBus.execute(command);
			expect(data).toMatchObject([]);
		});
	});
	describe('CheckUserPassCommand', () => {
		const reqData = {
			username: undefined,
			password: undefined
		};
		test('check username is empty ', async () => {
			const command = CheckUserPassCommand.buildFromJSON({...reqData, password: 'p2ssword'});

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[{field: 'username', message: global.__getDictionary('__ERROR_EMPTY_USERNAME__')}],
					global.__getDictionary('__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__')
				)
			);
		});

		test('check Incorrect password ', async () => {
			const command = CheckUserPassCommand.buildFromJSON({...reqData, username: 'user1'});

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[
						{
							field: 'password',
							message: global.__getDictionary('__ERROR_CHECK_USENAMEPASSWORD_WRONG_PASSWORD__')
						}
					],
					global.__getDictionary('__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__')
				)
			);
		});

		test('check  User is not active ', async () => {
			const command = CheckUserPassCommand.buildFromJSON({username: 'user1', password: 'p2ssword'});

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[
						{
							field: 'password',
							message: global.__getDictionary(
								'__ERROR_CHECK_USENAMEPASSWORD_INACTIVE_USER_STATUS__'
							)
						}
					],
					global.__getDictionary('__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__')
				)
			);
		});

		test('check  User wrong password', async () => {
			const command = CheckUserPassCommand.buildFromJSON({
				username: 'user2',
				password: 'p2sswordss'
			});

			await expect(commandBus.execute(command)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[],
					global.__getDictionary('__CHECK_USENAMEPASSWORD_VALIDATION_FAILED__')
				)
			);
		});

		test('check  User ok password', async () => {
			const command = CheckUserPassCommand.buildFromJSON({username: 'user2', password: 'p2ssword'});
			const {data} = await commandBus.execute(command);
			const resObj = {
				username: 'user2',
				password: '******',
				fullName: 'Fullname',
				role: 'USER',
				status: 'ACTIVE',
				emails: ['email@ttt.gr']
			};

			expect(data).toMatchObject([resObj]);
			// await expect(commandBus.execute(command)).resolves.toMatchObject()
		});
	});
});
