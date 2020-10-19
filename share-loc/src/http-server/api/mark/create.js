import Boom from '@hapi/boom';
import CreateMarkCommand from 'domain/mark/post/command';

export default async function createConnection(ctx) {
	const {params, request} = ctx;

	const command = CreateMarkCommand.buildFromJSON({
		payloadUser: {...request.jwtPayload.user},
		...params,
		...request.body
	});
	try {
		const connections = await ctx.commandBus.execute(command);

		ctx.status = 201;
		ctx.body = {
			statusCode: 201,
			...connections
		};
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Create Mark Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
