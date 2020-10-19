import Boom from '@hapi/boom';
import {getUser as getUserModel, getInitUser as getUserInitData} from 'data/proxy/user';

export default async function getUser(ctx) {
	const {params, request} = ctx;

	try {
		if (params.id === 'init') {
			const result = await getUserInitData();
			ctx.body = {
				...result
			};
		} else {
			const result = await getUserModel({...params, ...request.query});
			ctx.body = {
				...result
			};
		}
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Get User Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
