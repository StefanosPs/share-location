import Boom from '@hapi/boom';
import GetConnectionCommand from 'domain/connections/get/command';
import GetValidObserverCommand from 'domain/connections/get-valid-observer/command';

export default async function getConnection(ctx) {
	const { params, request } = ctx;

	// console.dir(request.query);
	// console.dir(request.query.filters.and);
	const command = GetConnectionCommand.buildFromJSON({
		payloadUser: { ...request.jwtPayload.user },
		...params,
		...request.query
	});

	try {
		const connections = await ctx.commandBus.execute(command);
		if (connections.data && connections.data.length < 1) {
			if (params.id) {
				Boom.notFound('missing');
			} else {
				ctx.status = 204;
				ctx.body = {
					statusCode: 204,
					...connections
				};
			}
		} else {
			ctx.body = {
				statusCode: 200,
				...connections
			};
		}
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Get Connections Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}

export async function gerValidObserver(ctx) {
	const { params, request } = ctx;

	const command = GetValidObserverCommand.buildFromJSON({
		payloadUser: { ...request.jwtPayload.user },
		...params,
		...request.query
	});
	try {
		const connections = await ctx.commandBus.execute(command);
		if (connections.data && connections.data.length < 1) {
			if (params.id) {
				Boom.notFound('missing');
			} else {
				ctx.status = 204;
				ctx.body = {
					statusCode: 204,
					...connections
				};
			}
		} else {
			ctx.body = {
				statusCode: 200,
				...connections
			};
		}
	} catch (err) {
		if (err.errors) {
			throw Boom.badData('Get Connections Failed', err.errors);
		} else if (err.status) {
			throw Boom.boomify(err, {
				statusCode: err.status
			});
		} else {
			throw err;
		}
	}
}
