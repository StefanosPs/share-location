/* eslint-disable no-param-reassign */
import IO from 'koa-socket-2';

import {ensureAuthenticated} from '../authentication/koa-router';

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
					// console.log('authenticate::jwtPayload', jwtPayload);
					socket.jwtPayload = jwtPayload;
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
	const {eventBus} = app.context.commandBus.registry;
	eventBus.on('createMark', data => {
		// console.log('broadcast');
		// console.log(data);
		location.broadcast('update-marks', data);
	});

	return app;
};

export default wsAttach;
