import Boom from '@hapi/boom';
import CheckUserPassCommand from 'domain/user/check-user-pass/command';

export default async function passwordCheck(ctx) {
	const {request} = ctx;

	const command = CheckUserPassCommand.buildFromJSON(request.body);
	try {
		const resp = await ctx.commandBus.execute(command);
		ctx.body = {
			statusCode: 200,
			...resp
		};
	} catch (err) {
		if (err.errors) {
			throw Boom.boomify(err, {
				statusCode: 422
			});
		} else {
			throw err;
		}
	}
}
