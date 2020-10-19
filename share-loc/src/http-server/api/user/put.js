import Boom from '@hapi/boom';
import {updateUser} from 'data/proxy/user';

export default async function putOrder(ctx) {
	const {params, request} = ctx;

	try {
		const result = await updateUser({...params, ...request.body});
		ctx.body = {
			...result
		};
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Update User Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
