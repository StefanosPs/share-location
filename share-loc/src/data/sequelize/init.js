import {Sequelize} from 'sequelize';
import jsyaml from 'js-yaml';
import fs from 'fs-extra';
import path from 'path';

const SEQUELIZE_CONNECT = process.env.SEQUELIZE_CONNECT || 'sequelize-mysql.yaml';

let sequelize;

async function connectDB() {
	if (sequelize) {
		return Promise.resolve(sequelize);
	}

	const fileParams = path.resolve('', SEQUELIZE_CONNECT);
	const yamltext = await fs.readFile(fileParams, 'utf8');
	const params = await jsyaml.safeLoad(yamltext, 'utf8');

	sequelize = new Sequelize(params.dbname, params.username, params.password, {
		...params.params,
		logging: process.env.NODE_ENV !== 'test'
	});

	return sequelize;
}

// eslint-disable-next-line import/prefer-default-export
export async function getInstance() {
	if (!sequelize) sequelize = await connectDB();
	return sequelize;
}
