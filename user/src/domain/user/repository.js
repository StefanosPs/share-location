/* eslint-disable no-return-await */
import bcrypt from 'bcryptjs';

import logger from '../../logger';
import UserError from './error';
import User from './user';

/**
 * Return the sanitized User
 * @param {*} param0
 * @returns {User}
 */
function sanitizedUser({ id, username, fullName, role, status, emails }) {
	return new User({
		id,
		username,
		password: '******',
		fullName,
		role,
		status,
		emails
	});
}
/**
 * Get the number of the users
 *
 * @throws {Error}
 *
 * @param {number} id - The id of the user
 * @returns {number}
 */
export async function countUsers(id) {
	if (!(this && this.countUsers)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}
	const reqId = id ? parseInt(id, 10) : 0;

	return await this.countUsers(reqId);
}
/**
 * Create a user
 *
 * @throws {Error}
 * @throws {UserError}
 *
 * @param {User} user
 * @returns {(User|undefined)}
 */
export async function createUser(user) {
	if (!(this && this.createUser)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}
	if (!user.username || !user.role || !user.status) {
		throw new UserError(
			this,
			422,
			[],
			`createUser:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}

	const password = user.password ? await bcrypt.hashSync(user.password, 10) : undefined;
	if (user instanceof User) {
		const resUser = await this.createUser(
			user.fullName,
			user.username,
			password,
			user.role,
			user.status,
			user.provider,
			user.emails
		);

		return resUser ? sanitizedUser(resUser) : undefined;
	}

	throw new UserError(
		this,
		422,
		[],
		`createUser:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
	);
}
/**
 * Get a user
 *
 * @throws {Error}
 *
 * @param {number} id - The id of the user
 * @param {Object} params?
 * @param {number[]} params.idIn - the IDs
 * @param {Object} params.where - field - value for where
 * @param {number} params.page - The page
 * @param {number} params.sizePerPage - The size per page
 * @param {string} params.order - The field to order the results
 * @returns {([User]|undefined)}
 */
export async function getUser(id, params = {}) {
	if (!(this && this.getUser)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}
	const userArray = await this.getUser(id, params);
	return userArray ? userArray.map(el => sanitizedUser(el)) : undefined;
}
/**
 * Get a user by username
 *
 * @throws {Error}
 *
 * @param {string} username - The id of the user
 * @param {Object} params?
 * @param {Object} params.where - field - value for where
 * @param {number} params.page - The page
 * @param {number} params.sizePerPage - The size per page
 * @param {string} params.order - The field to order the results
 * @returns {(User|undefined)}
 */
export async function getUserByUsername(username, params = {}) {
	if (!(this && this.getUserByUsername)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!username) {
		logger.error(`getUserByUsername:: ${global.__getDictionary('__ERROR_EMPTY_USERNAME__')}`);
		throw new UserError(
			null,
			500,
			[],
			`getUserByUsername:: ${global.__getDictionary('__ERROR_EMPTY_USERNAME__')}`
		);
	}

	const resUser = await this.getUserByUsername(username, params);
	return resUser ? sanitizedUser(resUser) : undefined;
}
/**
 * Update a user Record
 *
 * @throws {Error}
 * @throws {UserError}
 *
 * @param {number} id  - The ID of the user to update
 * @param {User} user  - The new user object
 */
export async function updateUser(id, user) {
	if (!(this && this.updateUser)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!id) {
		logger.error(`${global.__getDictionary('__ERROR_EMPTY_ID__')}`);
		throw new UserError(null, 500, [], `${global.__getDictionary('__ERROR_EMPTY_ID__')}`);
	}

	if (user instanceof User) {
		const updData = { ...user };
		if ('password' in updData && updData.password !== '******') {
			updData.password = await bcrypt.hashSync(user.password, 10);
		}
		const resUser = await this.updateUser(id, {
			...updData
		});
		return resUser ? sanitizedUser(resUser) : undefined;
	}
	throw new UserError(
		this,
		422,
		[],
		`updateUser:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
	);
}
/**
 * Delete a user
 *
 *  @throws {Error}
 *
 * @param {number} id - The ID of the user
 * @return {user}
 */
export async function deleteUser(id) {
	if (!(this && this.deleteUser)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	if (!id) {
		logger.error(`${global.__getDictionary('__ERROR_EMPTY_ID__')}`);
		throw new UserError(null, 500, [], `${global.__getDictionary('__ERROR_EMPTY_ID__')}`);
	}
	const resUser = await this.deleteUser(id);
	return resUser ? sanitizedUser(resUser) : undefined;
}
/**
 * Check if the username and passwords is valid for login
 *
 * @throws {Error}
 * @throws {UserError}
 *
 * @param {number} id - The ID of the user
 * @return {user}
 */
export async function userPasswordCheck(username, password) {
	if (!(this && this.getUserByUsername)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}
	const user = await this.getUserByUsername(username);
	if (!user) {
		throw new UserError(null, 422, [], `${global.__getDictionary('__ERROR_USER_NOT_FOUND__')}`);
	}

	if (user.username === username) {
		const compare = await bcrypt.compareSync(password, user.password);
		if (compare) {
			const retUsr = sanitizedUser(user);
			return retUsr;
		}
	}
	throw new UserError(this, 422, [], `${global.__getDictionary('__ERROR_WRONG_PASSWORD__')}`);
}
