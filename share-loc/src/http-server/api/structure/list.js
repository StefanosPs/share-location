import Boom from '@hapi/boom';
import {read} from 'data/fs/stucture';

export default async function getListStructure(ctx) {
	const {params} = ctx;
	try {
		const data = await read(`${params.table}_list`);
		// console.log(data);
		ctx.body = {
			statusCode: 200,
			data: {...data}
		};
	} catch (err) {
		console.log(err);
		if (err.errors) {
			throw Boom.badData('Get List Structure', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
