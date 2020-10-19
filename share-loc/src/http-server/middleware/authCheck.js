import Boom from '@hapi/boom';
// import logger from '../../logger';

import {ensureAuthenticatedHttp} from '../../authentication/koa-router';

export default async function authorizationCheck(ctx, next) {
	try {
		await ensureAuthenticatedHttp(ctx);
	} catch (error) {
		throw Boom.unauthorized('Unauthorized');
	}
	await next(ctx);
}
