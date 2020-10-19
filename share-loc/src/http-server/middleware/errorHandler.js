import Boom from '@hapi/boom';
import logger from '../../logger';

export default async function errorHandler(ctx, next) {
	try {
		await next(ctx);
	} catch (err) {
		let error = err;
		if (!Boom.isBoom(err)) {
			if (err.name === 'UnauthorizedError') {
				error = Boom.unauthorized(err.message);
			}
		}
		// console.log('error', error);
		const boom = Boom.boomify(error);
		// console.log('boom', boom);
		if (err.data) {
			boom.output.payload.errors = err.data;
		}

		if (err.errors) {
			boom.output.payload.errors = err.errors;
		} else if (err.response && err.response.body && err.response.body.errors) {
			boom.output.payload.errors = err.response.body.errors;
		}
		if (err.response && err.response.body && err.response.body.message) {
			boom.output.payload.message = err.response.body.message;
		}

		ctx.response.status = boom.output.statusCode;
		ctx.response.set(boom.output.headers);
		ctx.response.body = boom.output.payload;

		// print unknown error stack to stderr
		if (boom.output.statusCode >= 500) {
			logger.error(boom.stack);
		}
	}
}
