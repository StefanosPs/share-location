/* eslint-disable no-return-await */
import {Model, DataTypes} from 'sequelize';

import {getInstance} from '../init';

const tableName = 'active_token';
let SQToken;

class TokenModel extends Model {}

export function sanitizedToken(token) {
	// log(util.inspect(user));
	const ret = {
		id: token.id,
		userId: token.user_id,
		token: token.token
	};

	return ret;
}

export function initializeModel(sequelize) {
	return TokenModel.init(
		{
			id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
			user_id: {type: DataTypes.INTEGER},
			token: {type: DataTypes.STRING}
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

async function getTokenModel() {
	if (SQToken) return await SQToken.sync();

	const sequelize = await getInstance();

	if (!SQToken) {
		SQToken = initializeModel(sequelize);
	}

	return await SQToken.sync();
}

export async function findTokenByID(id) {
	if (!id) return undefined;
	const SQTokenModel = await getTokenModel();
	const token = await SQTokenModel.findByPk(id);
	const ret = token ? sanitizedToken(token) : undefined;

	return ret;
}

export async function createToken({token, userId}) {
	const SQTokenModel = await getTokenModel();
	const dbToken = await SQTokenModel.create({
		token,
		user_id: userId
	});
	return dbToken;
}
export async function deleteToken(id) {
	if (!id) {
		throw Error('Empty id');
	}
	const SQTokenModel = await getTokenModel();
	const token = await SQTokenModel.findByPk(id);
	if (token === null) {
		throw Error('Token has already been destroyed');
	} else {
		return token.destroy();
	}
}
