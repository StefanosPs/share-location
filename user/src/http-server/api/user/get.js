import Boom from '@hapi/boom';
import GetUserCommand from 'domain/user/get/command';

export default async function getUser(ctx) {
	const {params, request} = ctx;

	// console.log(request.query);
	const command = GetUserCommand.buildFromJSON({...params, ...request.query});
	try {
		const user = await ctx.commandBus.execute(command);

		if (user.data && user.data.length < 1) {
			if (params.id) {
				Boom.notFound('missing');
			} else {
				ctx.status = 204;
				ctx.body = {
					statusCode: 204,
					...user
				};
			}
		} else {
			ctx.body = {
				statusCode: 200,
				...user
			};
		}
	} catch (err) {
		console.error(err);
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
