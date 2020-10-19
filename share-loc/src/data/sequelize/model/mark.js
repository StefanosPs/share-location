/* eslint-disable no-return-await */
import {Model, DataTypes} from 'sequelize';

import {getInstance} from '../init';

const tableName = 'mark';
let SQMarkConnection;

class UserMarkModel extends Model {}

function sanitizedMark(mark) {
	const ret = {
		userId: mark.user_id
	};

	try {
		ret.position = JSON.parse(mark.position);
	} catch (e) {
		ret.position = [];
	}

	return ret;
}

function initializeModel(sequelize) {
	return UserMarkModel.init(
		{
			user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
			position: {type: DataTypes.STRING}
		},
		{
			sequelize,
			tableName,
			timestamps: true,
			createdAt: false,
			updatedAt: 'updateTimestamp'
		}
	);
}

async function getMarkModel() {
	if (SQMarkConnection) return await SQMarkConnection.sync();

	const sequelize = await getInstance();

	if (!SQMarkConnection) {
		SQMarkConnection = initializeModel(sequelize);
	}

	return await SQMarkConnection.sync();
}

async function findByID(userId) {
	const SQMarkModel = await getMarkModel();
	const mark = await SQMarkModel.findOne({where: {user_id: userId}});
	const ret = mark ? sanitizedMark(mark) : undefined;

	return ret;
}
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
		if ('userId' in params.where) {
			findAllParams.where.user_id = params.where.userId;
		}
	}

	const SQMarkModel = await getMarkModel();
	const markList = await SQMarkModel.findAll(findAllParams);
	return markList.map(mark => sanitizedMark(mark));
}
export async function countMark(userId) {
	const SQMarkModel = await getMarkModel();

	const condition = {};
	if (userId) {
		condition.where = {user_id: userId};
	}
	const cnt = await SQMarkModel.count(condition);
	const ret = cnt ? Number(cnt) : 0;
	return ret;
}

export async function createUpdateMark(userId, position) {
	const SQMarkModel = await getMarkModel();
	const mark = await SQMarkModel.upsert({
		user_id: userId,
		position: JSON.stringify(position)
	});

	return mark[0] ? sanitizedMark(mark[0]) : undefined;
}

export async function getMark(userId, params = {}) {
	if (userId) {
		const mark = await findByID(userId);
		return mark ? [mark] : undefined;
	}
	return findAll(params);
}

export async function getMarkOfConnections(usersIds, params = {}) {
	const args = {...params};
	if (!usersIds || !Array.isArray(usersIds)) {
		throw Error('Empty usersIds');
	}

	args.where = {
		user_id: usersIds
	};

	return findAll(args);
}

export async function deleteMark(userId) {
	if (!userId) {
		throw Error('Empty id');
	}
	const SQMarkModel = await getMarkModel();
	const user = await SQMarkModel.findByPk(userId);
	if (user === null) {
		throw Error(`Didn't find '${userId}' to delete`);
	} else {
		return user.destroy();
	}
}
