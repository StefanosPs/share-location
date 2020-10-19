import Boom from '@hapi/boom';
import {createUser as createUserModel} from 'data/proxy/user';

export default async function createUser(ctx) {
	const {request} = ctx;
	try {
		const resp = await createUserModel(request.body);
		ctx.status = 201;
		ctx.body = {
			...resp
		};
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Create User Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
