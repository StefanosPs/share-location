import Boom from '@hapi/boom';
import DeleteUserCommand from 'domain/user/delete/command';

export default async function deleteUser(ctx) {
	const {params} = ctx;
	const command = DeleteUserCommand.buildFromJSON(params);
	try {
		const deleteUserResult = await ctx.commandBus.execute(command);
		ctx.status = 200;
		ctx.body = {
			statusCode: 200,
			...deleteUserResult
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
