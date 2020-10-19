/* eslint-disable import/prefer-default-export */

/**
 * An error designating that something is wrong
 * with creating an order.
 */
// errorCode = 400 for Invalide request

export default class UserError extends Error {
	constructor(userCommand, errorCode, errors, ...params) {
		super(...params);
		this.name = 'UserError';
		if (userCommand) {
			this.command = userCommand;
		}
		this.errorCode = errorCode;
		this.errors = errors;
		this.date = new Date();

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UserError);
		}
	}
}
