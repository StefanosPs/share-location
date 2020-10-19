import Boom from '@hapi/boom';
import UpdateUserCommand from 'domain/user/put/command';

export default async function putUser(ctx) {
	const {params} = ctx;
	const {request} = ctx;
	const command = UpdateUserCommand.buildFromJSON({...params, ...request.body});
	try {
		const user = await ctx.commandBus.execute(command);
		ctx.body = {
			statusCode: 200,
			...user
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
