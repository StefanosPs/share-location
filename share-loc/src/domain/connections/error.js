/* eslint-disable import/prefer-default-export */

/**
 * An error designating that something is wrong
 * with creating an order.
 */
// errorCode = 400 for Invalide request

export default class ConnectionError extends Error {
	constructor(connectionCommand, errorCode, errors, ...params) {
		super(...params);
		this.name = 'ConnectionError';
		if (connectionCommand) {
			this.command = connectionCommand;
		}
		this.errorCode = errorCode;
		this.errors = errors;
		this.date = new Date();

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ConnectionError);
		}
	}
}
