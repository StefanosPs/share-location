/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import {Model, DataTypes, Op} from 'sequelize';

import getInstance from '../init';

class UserModel extends Model {}

let SQUser;

export function sanitizedUser(user) {
	const ret = {
		id: user.id,
		username: user.username,
		password: user.password,
		fullName: user.full_name,
		role: user.role,
		status: user.status,
		provider: user.provider
	};
	try {
		ret.emails = JSON.parse(user.emails);
	} catch (e) {
		ret.emails = [];
	}

	return ret;
}

function initializeModel(sequelize) {
	return UserModel.init(
		{
			id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
			full_name: {type: DataTypes.STRING},
			username: {type: DataTypes.STRING, unique: 'compositeIndex'},
			password: {type: DataTypes.STRING},
			role: {type: DataTypes.STRING},
			status: {type: DataTypes.STRING},
			provider: {type: DataTypes.STRING},
			emails: {type: DataTypes.STRING}
		},
		{
			sequelize,
			tableName: 'user',
			timestamps: true,
			createdAt: false,
			updatedAt: 'updateTimestamp'
		}
	);
}

async function getUserModel() {
	try {
		if (SQUser) return await SQUser.sync();
	} catch (error) {
		console.error(error);
		return null;
	}

	const sequelize = await getInstance();

	if (!SQUser) {
		SQUser = initializeModel(sequelize);
	}

	try {
		return await SQUser.sync();
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * Find a user by ID
 *
 * @param {number} id - The id of the user
 * @returns {(Object|undefined)}
 */
async function findByID(id) {
	if (!id) {
		return undefined;
	}

	const SQUserInstance = await getUserModel();
	const user = await SQUserInstance.findOne({where: {id}});
	const ret = user ? sanitizedUser(user) : undefined;

	return ret;
}
/**
 * Find a user
 *
 * @param {Object} params?
 * @param {number[]} params.idIn - the IDs
 * @param {Object} params.where - field - value for where
 * @param {number} params.page - The page
 * @param {number} params.sizePerPage - The size per page
 * @param {string} params.order - The field to order the results
 */
async function findAll(params = {}) {
	const findAllParams = {};

	if (params.page && params.sizePerPage) {
		findAllParams.offset = (params.page - 1) * params.sizePerPage;
		findAllParams.limit = params.sizePerPage;
	}

	if (params.order) {
		findAllParams.order = params.order;
	}
	if (params.where) {
		findAllParams.where = {};
		if (params.where.in) {
			for (const prp in params.where.in) {
				if (!findAllParams.where[prp]) findAllParams.where[prp] = {};
				const value =
					params.where.in[prp] && Array.isArray(params.where.in[prp])
						? params.where.in[prp]
						: [params.where.in[prp]];
				findAllParams.where[prp] = {
					...findAllParams.where[prp],
					[Op.in]: value
				};
			}
			delete params.where.in;
		}

		if (params.where.notIn) {
			for (const prp in params.where.notIn) {
				if (!findAllParams.where[prp]) findAllParams.where[prp] = {};
				const value =
					params.where.notIn[prp] && Array.isArray(params.where.notIn[prp])
						? params.where.notIn[prp]
						: [params.where.notIn[prp]];
				findAllParams.where[prp] = {
					...findAllParams.where[prp],
					[Op.notIn]: value
				};
			}
			delete params.where.notIn;
		}

		findAllParams.where = {...findAllParams.where, ...params.where};
	}

	const SQUserInstance = await getUserModel();
	console.log(findAllParams);
	const userList = await SQUserInstance.findAll(findAllParams);
	const ret = userList.map(user => sanitizedUser(user));
	return ret;
}
/**
 * Get the number of the users
 *
 * @param {number} id? - The id of the user
 * @returns {number}
 */
export async function countUsers(id) {
	const SQUserInstance = await getUserModel();

	const condition = {};
	if (id && typeof id === 'number') {
		condition.where = {id};
	}
	const cnt = await SQUserInstance.count(condition);
	const ret = cnt ? parseInt(cnt, 10) : 0;
	return ret;
}
/**
 * Get user by username
 *
 * @param {string} username - The username of the user
 * @returns {(Object|undefined)}
 */
export async function getUserByUsername(username) {
	const findByUsernameParams = {};

	if (username && typeof username === 'string') {
		findByUsernameParams.where = {username};
	} else {
		throw new Error('Username can not be empty');
	}

	const SQUserInstance = await getUserModel();
	const user = await SQUserInstance.findOne(findByUsernameParams);
	const ret = user ? sanitizedUser(user) : undefined;

	return ret;
}

export async function createUser(fullName, username, password, role, status, provider, emails) {
	const SQUserInstance = await getUserModel();
	const user = await SQUserInstance.create({
		username,
		password,
		full_name: fullName,
		provider,
		role,
		status,
		emails: JSON.stringify(emails)
	});

	return user ? sanitizedUser(user) : undefined;
}
export async function getUser(id, params = {}) {
	if (id) {
		const user = await findByID(id);
		return user ? [user] : undefined;
	}
	const findParams = {...params};
	if (findParams.idIn && Array.isArray(findParams.idIn)) {
		if (!findParams.where) {
			findParams.where = {};
		}
		findParams.where.id = params.idIn;
		delete findParams.idIn;
	}

	const users = await findAll(findParams);
	return users;
}
export async function updateUser(id, data = {}) {
	const updateData = {...data};
	if ('fullName' in updateData) {
		updateData.full_name = updateData.fullName;
		delete updateData.fullName;
	}
	if ('emails' in updateData) updateData.emails = JSON.stringify(updateData.emails);

	if (!id) {
		return new Promise(() => {
			throw new Error('Empty id');
		});
	}
	const SQUserInstance = await getUserModel();

	await SQUserInstance.update(updateData, {
		where: {
			id
		}
	});

	return findByID(id);
}

export async function deleteUser(id) {
	if (!id) {
		return new Promise(() => {
			throw Error('Empty id');
		});
	}

	const SQUserInstance = await getUserModel();

	const user = await SQUserInstance.findByPk(id);
	if (!user) throw new Error(`Didn't find '${id}' to delete`);
	const resUser = await user.destroy();
	return resUser ? sanitizedUser(resUser) : undefined;
}
