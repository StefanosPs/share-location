import Boom from '@hapi/boom';
import {deleteUser} from 'data/proxy/user';

export default async function deleteUsr(ctx) {
	const {params} = ctx;
	try {
		const result = await deleteUser(params);
		ctx.body = {
			...result
		};
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Delete User Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
