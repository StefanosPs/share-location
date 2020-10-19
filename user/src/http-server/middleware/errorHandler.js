import Boom from '@hapi/boom';
import logger from 'logger';

export default async function errorHandler(ctx, next) {
	try {
		await next();
	} catch (err) {
		// const options = {};
		let error = err;
		if (!Boom.isBoom(err)) {
			if (err.name === 'UnauthorizedError') {
				error = Boom.unauthorized(err.message);
			}
		}

		const boom = Boom.boomify(error);
		if (err.data) {
			boom.output.payload.errors = err.data;
		}
		if (err.errors) {
			boom.output.payload.errors = err.errors;
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
