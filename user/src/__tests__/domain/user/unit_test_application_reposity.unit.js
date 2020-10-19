/* eslint no-await-in-loop: "error" */
import DB from '../../../data/sequelize';
import {
	countUsers,
	createUser,
	getUser,
	getUserByUsername,
	updateUser,
	deleteUser,
	userPasswordCheck
} from '../../../domain/user/repository';

// process.env.SEQUELIZE_CONNECT = global.SEQUELIZE_CONNECT;
import User from '../../../domain/user/user';
import UserError from '../../../domain/user/error';

global.__getDictionary = index => {
	return index;
};

const recordsAr = [];

describe('user/repository.js', () => {
	beforeAll(async () => {
		expect(process.env.SEQUELIZE_CONNECT).toContain('test');
		try {
			const users = await DB.getUser();
			const results = [];
			for (let index = 0; index < users.length; index += 1) {
				const el = users[index];
				results.push(DB.deleteUser(el.id));
			}
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
				'full name 2',
				'username3',
				'password',
				'USER',
				'ACTIVE',
				'',
				['mail01@gmail.com', 'mail02@gmail.com']
			);
		} catch (e) {
			console.error(e);
			throw e;
		}
	});
	// afterAll(async () => {
	//   const users = await DB.getUser();
	//   for (let user of users) {
	//     await DB.deleteUser(user.id);
	//   }
	// });

	describe('countUsers', () => {
		test('should throw bind error', async () => {
			await expect(countUsers()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('should have 3 entries', async () => {
			await expect(countUsers.call(DB)).resolves.toBe(3);
		});
		test('should have 1 entries ( record exists) ', async () => {
			await expect(countUsers.call(DB, recordsAr[0].id)).resolves.toBe(1);
		});
	});

	describe('Create', () => {
		test('should throw bind error', async () => {
			await expect(createUser()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('should throw UserError ', async () => {
			const user = new User();
			await expect(createUser.call(DB, user)).rejects.toThrowError(
				new UserError(
					this,
					422,
					[],
					`createUser:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});
		test('username must be unique ', async () => {
			const userArgs = new User({
				username: 'username3',
				password: 'password',
				fullName: 'fullName',
				role: 'USER',
				status: 'ACTIVE',
				emails: ['mail01@gmail.com', 'mail02@gmail.com']
			});
			// const userResult = new User({
			//   username: 'username3',
			//   password: '******',
			//   fullName: 'fullName',
			//   role: 'USER',
			//   status: 'ACTIVE',
			//   emails: ['mail01@gmail.com', 'mail02@gmail.com']
			// });

			await expect(createUser.call(DB, userArgs)).rejects.toThrowError();
		});

		test('create user ', async () => {
			const userArgs = new User({
				username: 'username4',
				password: 'password',
				fullName: 'fullName4',
				role: 'USER',
				status: 'ACTIVE',
				emails: ['mail01@gmail.com', 'mail02@gmail.com']
			});
			const userResult = new User({
				username: 'username4',
				password: '******',
				fullName: 'fullName4',
				role: 'USER',
				status: 'ACTIVE',
				emails: ['mail01@gmail.com', 'mail02@gmail.com']
			});

			await expect(createUser.call(DB, userArgs)).resolves.toMatchObject(userResult);
		});
	});

	describe('Read', () => {
		test('should throw bind error', async () => {
			await expect(getUser()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('should getByID', async () => {
			const userResult = new User({
				username: 'username1',
				password: '******',
				fullName: 'full name 1',
				role: 'USER',
				status: 'ACTIVE',
				emails: ['mail01@gmail.com', 'mail02@gmail.com']
			});
			const {id} = recordsAr[0];
			await expect(getUser.call(DB, id, {})).resolves.toMatchObject([userResult]);
			const params = {idIn: [id]};
			await expect(getUser.call(DB, 0, params)).resolves.toMatchObject([userResult]);
		});

		test('should throw bind error', async () => {
			await expect(getUserByUsername()).rejects.toThrowError();
		});

		test('should throw bind error', async () => {
			const user = getUser.call(DB, 0, {where: {username: 'username2'}});

			await expect(getUserByUsername.call(DB, 'username2')).resolves.toMatchObject(user);
		});
	});

	describe('Update', () => {
		test('should throw bind error', async () => {
			await expect(updateUser()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('ID required', async () => {
			await expect(updateUser.call(DB)).rejects.toThrowError(
				new UserError(null, 500, [], `${global.__getDictionary('__ERROR_EMPTY_ID__')}`)
			);
		});
		test('Update User', async () => {
			const {id} = recordsAr[0];
			const user = new User({username: 'username55'});
			const userRes = {
				id: recordsAr[0].id,
				username: 'username55',
				password: '******',
				fullName: recordsAr[0].fullName,
				role: recordsAr[0].role,
				status: recordsAr[0].status,
				emails: recordsAr[0].emails
			};
			await expect(updateUser.call(DB, id, user)).resolves.toMatchObject(userRes);
		});
	});
});

describe('Delete', () => {
	test('should throw bind error', async () => {
		await expect(deleteUser()).rejects.toThrowError(
			Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
		);
	});

	test('ID required', async () => {
		await expect(deleteUser.call(DB)).rejects.toThrowError(
			new UserError(null, 500, [], `${global.__getDictionary('__ERROR_EMPTY_ID__')}`)
		);
	});

	test('Delete user', async () => {
		const {id} = recordsAr[2];
		const userRes = await getUser.call(DB, id, {});
		await expect(deleteUser.call(DB, id)).resolves.toMatchObject({...userRes[0]});
	});
});

describe('General', () => {
	test('should throw bind error', async () => {
		await expect(userPasswordCheck()).rejects.toThrowError(
			// /TODO make tests
			Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
		);
	});
	test('Wrong password', async () => {
		// const {id} = recordsAr[1];
		const userRes = await getUserByUsername.call(DB, 'username4', {});
		// console.log(userRes);
		await expect(userPasswordCheck.call(DB, userRes.username, 'password00')).rejects.toThrowError(
			new UserError(this, 422, [], `${global.__getDictionary('__ERROR_WRONG_PASSWORD__')}`)
		);
	});
	test('Check password', async () => {
		// const {id} = recordsAr[1];
		const userRes = await getUserByUsername.call(DB, 'username4', {});
		// console.log(userRes);
		await expect(userPasswordCheck.call(DB, userRes.username, 'password')).resolves.toMatchObject({
			...userRes[0]
		});
	});
});
