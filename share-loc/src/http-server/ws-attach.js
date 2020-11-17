/* eslint-disable no-param-reassign */
import IO from 'koa-socket-2';

import GetConnectionCommand from 'domain/connections/get/command';

import { ensureAuthenticated } from '../authentication/koa-router';
import logger from 'koa-pino-logger';

const wsAttach = app => {
	const location = new IO({
		namespace: 'websocket/location',
		transports: ['websocket']
	});

	location.attach(app);

	// io.use((socket, next) => {
	//   return next();
	// });

	location.on('connection', socket => {
		socket.on('authenticate', async data => {
			try {
				const jwtPayload = await ensureAuthenticated(data.token);
				if (jwtPayload) {
					socket.jwtPayload = jwtPayload;

					const command = GetConnectionCommand.buildFromJSON({
						payloadUser: { ...jwtPayload.user }
					});
					const connections = await app.context.commandBus.execute(command);

					if (connections && connections.data) {
						socket.observes = connections.data.map(el => {
							return el.observeUserId;
						});
					}
					console.log('socket.observes ', socket.observes);

					socket.emit('authenticated');
					return;
				}
			} catch (error) {
				socket.emit('unauthorized', error.message);
			}

			socket.emit('unauthorized', 'General Error');
		});

		setTimeout(() => {
			if (!(socket && socket.jwtPayload && socket.jwtPayload.user)) {
				socket.disconnect(true);
			}
		}, 3000);
	});
	location.on('message', (ctx, data) => {
		console.log(data);
		console.log(ctx.data, data);
	});
	// console.log(app.context.commandBus.registry.eventBus);
	const { eventBus } = app.context.commandBus.registry;
	eventBus.on('createMark', data => {
		if (!data.userId) {
			logger.error(`on createMark wrong data `, data);
			return null;
		}
		location.connections.forEach(socket => {
			if (socket.observes.includes(data.userId)) {
				socket.emit('update-marks', data);
			}
		});
	});

	return app;
};

export default wsAttach;
