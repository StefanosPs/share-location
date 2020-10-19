import Boom from '@hapi/boom';
import UpdateConnectionCommand from 'domain/connections/put/command';

export default async function putConnection(ctx) {
	const {params, request} = ctx;

	const command = UpdateConnectionCommand.buildFromJSON({
		payloadUser: {...request.jwtPayload.user},
		...params,
		...request.body
	});

	try {
		const connections = await ctx.commandBus.execute(command);
		ctx.body = {
			statusCode: 200,
			...connections
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
