// import {HttpError} from 'koa';
import request from 'superagent';
import url from 'url';

import Boom from '@hapi/boom';

import logger from '../../logger';

const {URL} = url;

const authUserName = process.env.BASIC_AUTH_USERNAME || 'usersrv';
const authUPassword = process.env.BASIC_AUTH_PASSWORD || 'basic-auth-password';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://127.0.0.1:3333';

function reqURL(path) {
	const requrl = new URL(USER_SERVICE_URL);
	requrl.pathname = path;
	return requrl.toString();
}

const handleError = (fnName, e) => {
	if (e.code && e.code === 'ECONNREFUSED') {
		e.message = 'connect ECONNREFUSED';
		logger.error(`Function ${fnName} network ERROR ${e.stack}`);
		return [];
	}
	// console.log('e',e);
	// console.log('e.response.body',e.response.body);
	if (e.response.body.statusCode) {
		throw Boom.boomify(e, {
			statusCode: e.response.body.statusCode
		});
	}
	if (e.status >= 300) {
		e.message = e.response.body.message;
	}

	throw e;
};

export async function userPasswordCheck({username, password}) {
	try {
		// logger.info(`userPasswordCheck()`);
		const res = await request
			.post(reqURL(`/api/password-check`))
			.send({username, password})
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.auth(authUserName, authUPassword);
		return res.body;
	} catch (e) {
		handleError(`userPasswordCheck`, e);
	}
	return undefined;
}

export async function createUser({username, password, fullName, provider, role, status, emails}) {
	try {
		// logger.info(`create(${username}, ${password}, ${provider}, ${role}, ${status}, ${emails})`);
		const res = await request
			.post(reqURL('/api/user'))
			.send({
				username,
				password,
				fullName,
				provider,
				role,
				status,
				emails
			})
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.auth(authUserName, authUPassword);
		return res.body;
	} catch (e) {
		handleError(`createUser`, e);
	}
	return undefined;
}

export async function getInitUser() {
	try {
		const res = await request
			.get(reqURL(`/api/user/init`))
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.auth(authUserName, authUPassword);
		return res.body;
	} catch (e) {
		handleError(`getInitUser`, e);
	}
	return undefined;
}

export async function getUser({id = 0, where, page, sizePerPage, sortField, sortOrder}) {
	const urlPath = id ? `/api/user/${parseInt(id, 10)}` : `/api/user/`;

	let urlParams = {};
	if (where) {
		urlParams = {...where};
	}
	if (page) {
		urlParams.page = parseInt(page, 10);
	}
	if (sizePerPage) {
		urlParams.sizePerPage = parseInt(sizePerPage, 10);
	}
	if (sortField) {
		urlParams.sortField = sortField;
	}
	if (sortOrder) {
		urlParams.sortOrder = sortOrder.toUpperCase();
	}

	// request.query
	try {
		const res = await request
			.get(reqURL(`${urlPath}`))
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.query(urlParams)
			.auth(authUserName, authUPassword);
		return res.body;
	} catch (e) {
		handleError(`getUser`, e);
	}
	return undefined;
}
export async function updateUser({
	id,
	username,
	password,
	fullName,
	provider,
	role,
	status,
	emails
}) {
	id = parseInt(id, 10);
	try {
		const res = await request
			.put(reqURL(`/api/user/${id}`))
			.send({
				username,
				password,
				fullName,
				provider,
				role,
				status,
				emails
			})
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.auth(authUserName, authUPassword);
		return res.body;
	} catch (e) {
		handleError(`updateUser`, e);
	}
	return undefined;
}
export async function deleteUser({id = 0}) {
	id = parseInt(id, 10);
	try {
		const res = await request
			.delete(reqURL(`/api/user/${id}`))
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.auth(authUserName, authUPassword);
		return res.body;
	} catch (e) {
		handleError(`deleteUser`, e);
	}
	return undefined;
}
