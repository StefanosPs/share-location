import Boom from '@hapi/boom';
import {read} from 'data/fs/stucture';

export default async function getTableStructure(ctx) {
	const {params} = ctx;
	try {
		const data = await read(`${params.table}_table`);

		ctx.body = {
			statusCode: 200,
			data: {...data}
		};
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Get Table Structure', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
