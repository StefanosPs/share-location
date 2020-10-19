import {Sequelize} from 'sequelize';
import jsyaml from 'js-yaml';

import fs from 'fs';
import path from 'path';

const SEQUELIZE_CONNECT = process.env.SEQUELIZE_CONNECT || 'sequelize-mysql.yaml';
let sequelize;
let SQUser;

async function connectDB() {
	if (SQUser) return SQUser.sync();

	const fileParams = path.resolve('', SEQUELIZE_CONNECT);
	// let yamltext = null;
	// yamltext = await filehandle.readFile(filehandle);
	const yamltext = await fs.readFileSync(fileParams, 'utf8');
	const params = await jsyaml.safeLoad(yamltext, 'utf8');

	if (!sequelize)
		sequelize = new Sequelize(params.dbname, params.username, params.password, {
			...params.params,
			logging: process.env.NODE_ENV !== 'test'
		});

	return sequelize;
}

export default async function getInstance() {
	if (!sequelize) sequelize = await connectDB();
	return sequelize;
}
