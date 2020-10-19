import Boom from '@hapi/boom';
import CreateOrderCommand from 'domain/user/post/command';

export default async function createUser(ctx) {
	const {request} = ctx;

	const command = CreateOrderCommand.buildFromJSON(request.body);
	try {
		const user = await ctx.commandBus.execute(command);
		ctx.status = 201;
		ctx.body = {
			statusCode: 201,
			...user
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
