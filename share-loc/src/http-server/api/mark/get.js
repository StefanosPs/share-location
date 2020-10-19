import Boom from '@hapi/boom';
import GetMarkCommand from 'domain/mark/get/command';

export default async function getUser(ctx) {
	const {params, request} = ctx;

	const command = GetMarkCommand.buildFromJSON({
		payloadUser: {...request.jwtPayload.user},
		...params,
		...request.query
	});
	try {
		const marks = await ctx.commandBus.execute(command);
		if (marks.data && marks.data.length < 1) {
			if (params.id) {
				Boom.notFound('missing');
			} else {
				ctx.status = 204;
				ctx.body = {
					statusCode: 204,
					...marks
				};
			}
		} else {
			ctx.body = {
				statusCode: 200,
				...marks
			};
		}
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Get Mark Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
