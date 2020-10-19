/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import {Model, DataTypes, Sequelize} from 'sequelize';

import {getInstance} from '../init';

const tableName = 'user_connection';
let SQUserConnection;

class UserConnectionModel extends Model {}

function sanitizedUserConnection(connection) {
	const ret = {
		id: connection.id,
		watcherUserId: connection.watcher_user,
		observeUserId: connection.observe_user,
		status: connection.status
	};

	return ret;
}

function initializeModel(sequelize) {
	return UserConnectionModel.init(
		{
			id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
			watcher_user: {type: DataTypes.INTEGER},
			observe_user: {type: DataTypes.INTEGER},
			status: {type: DataTypes.STRING}
		},
		{
			sequelize,
			tableName,
			timestamps: true,
			createdAt: false,
			updatedAt: 'updateTimestamp',
			indexes: [
				{
					name: 'unique_watcher_user_observe_user',
					fields: ['watcher_user', 'observe_user'],
					unique: true
				}
			]
		}
	);
}

async function getUserConnectionModel() {
	if (SQUserConnection) return await SQUserConnection.sync();

	const sequelize = await getInstance();

	if (!SQUserConnection) {
		SQUserConnection = initializeModel(sequelize);
	}

	return await SQUserConnection.sync();
}

async function findByID(id) {
	const SQUserConnectionModel = await getUserConnectionModel();
	const userConnection = await SQUserConnectionModel.findOne({where: {id}});
	const ret = userConnection ? sanitizedUserConnection(userConnection) : undefined;

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
		if ('watcherUserId' in params.where) {
			findAllParams.where.watcher_user = params.where.watcherUserId;
		}
		if ('observeUserId' in params.where) {
			findAllParams.where.observe_user = params.where.observeUserId;
		}
	}

	const SQUserConnectionModel = await getUserConnectionModel();
	const userConnectionList = await SQUserConnectionModel.findAll(findAllParams);
	return userConnectionList.map(userConnection => sanitizedUserConnection(userConnection));
}
export async function countConnection(id) {
	const SQUserConnectionModel = await getUserConnectionModel();

	const condition = {};
	if (id) {
		condition.where = {id};
	}
	const cnt = await SQUserConnectionModel.count(condition);
	return cnt ? Number(cnt) : 0;
}

export async function createConnection(watcherUserId, observeUserId, status) {
	const SQUserConnectionModel = await getUserConnectionModel();
	const userConnection = await SQUserConnectionModel.create({
		watcher_user: watcherUserId,
		observe_user: observeUserId,
		status
	});
	return userConnection ? sanitizedUserConnection(userConnection) : undefined;
}

export async function getConnection(id, params = {}) {
	if (id) {
		const user = await findByID(id);
		return user ? [user] : undefined;
	}
	return await findAll(params);
}

export async function getConnectionWatcher(watcherUserId, params = {}) {
	if (!watcherUserId) {
		throw new Error('Empty watcherUserId');
	}
	const args = {...params};

	args.where = {
		watcher_user: watcherUserId
	};

	return await findAll(args);
}

export async function getConnectionWatcherObserver(watcherUserId, observeUserId, params = {}) {
	if (!watcherUserId) {
		throw new Error('Empty watcherUserId');
	}
	if (!observeUserId) {
		throw new Error('Empty observeUserId');
	}
	const args = {...params};
	args.where = {
		watcherUserId,
		observeUserId
	};

	return await findAll(args);
}

export async function getUserOfConnection(watcherUserId, params = {}) {
	const findAllParams = {};

	if (params.page && params.sizePerPage) {
		findAllParams.offset = (params.page - 1) * params.sizePerPage;
		findAllParams.limit = params.sizePerPage;
	}

	if (params.order) {
		findAllParams.order = params.order;
	}

	const findAllParams00 = {...findAllParams, where: {watcher_user: watcherUserId}};
	const findAllParams01 = {...findAllParams, where: {watcher_user: watcherUserId}};

	findAllParams00.attributes = [
		[Sequelize.fn('DISTINCT', Sequelize.col('watcher_user')), 'watcher_user_distinct']
	];
	findAllParams01.attributes = [
		[Sequelize.fn('DISTINCT', Sequelize.col('observe_user')), 'observe_user_distinct']
	];

	// const res =  await findAll(params);
	const SQUserConnectionModel = await getUserConnectionModel();
	const [watcherUserDistinct, observeUserDistinct] = await Promise.all([
		SQUserConnectionModel.findAll(findAllParams00),
		SQUserConnectionModel.findAll(findAllParams01)
	]);

	const watcherAr = watcherUserDistinct.map(el => {
		if (el && el.dataValues.watcher_user_distinct) return el.dataValues.watcher_user_distinct;
	});
	const observeAr = observeUserDistinct.map(el => {
		if (el && el.dataValues.observe_user_distinct) return el.dataValues.observe_user_distinct;
	});

	return [...watcherAr, ...observeAr];
}

export async function updateConnection(id, data = {}) {
	const args = {...data};
	if ('watcherUserId' in args) {
		args.watcher_user = args.watcherUserId;
		delete args.watcherUserId;
	}
	if ('observeUserId' in args) {
		args.observe_user = args.observeUserId;
		delete args.observeUserId;
	}

	if (!id) {
		throw new Error('Empty id');
	}
	const SQUserConnectionModel = await getUserConnectionModel();
	await SQUserConnectionModel.update(args, {
		where: {
			id
		}
	});

	return findByID(id);
}

export async function deleteConnection(id) {
	if (!id) {
		throw new Error('Empty id');
	}
	const SQUserConnectionModel = await getUserConnectionModel();
	const userConnection = await SQUserConnectionModel.findByPk(id);
	if (!userConnection) throw new Error(`Didn't find '${id}' to delete`);

	const resUserConnection = await userConnection.destroy();
	return resUserConnection ? sanitizedUserConnection(resUserConnection) : undefined;
}
