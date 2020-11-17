import Koa from 'koa';
import Boom from '@hapi/boom';
import pino from 'koa-pino-logger';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';

// import IO from 'koa-socket-2';
// import websockify from 'koa-websocket';

import cors from '@koa/cors';
import {initPassport} from '../authentication/koa-router';
import errorHandler from './middleware/errorHandler';
import setLang from './middleware/setLang';
import validateRequest from './middleware/validateRequest';
import health from './health';
import wsAttach from './ws-attach';
import api from './api';

// import logger from '../logger';

const inProduction = process.env.NODE_ENV === 'production';

export default function createServer({commandBus} = {}) {
	if (!commandBus) {
		throw new Error('server: commandBus is missing');
	}

	const app = new Koa();

	app.keys = ['newest secret key', 'older secret key'];
	// app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
	Object.assign(app.context, {commandBus});

	// setup logging
	app.use(pino());

	// setup helmet
	if (inProduction) {
		// XXX https://helmetjs.github.io/docs/
		app.use(helmet());

		// app.use(
		//   helmet.contentSecurityPolicy({
		//     directives: {
		//       defaultSrc: ["'self'"],
		//       scriptSrc: ["'self'", "'unsafe-inline'"]
		//     }
		//   })
		// );

		app.use(helmet.dnsPrefetchControl({allow: false}));

		const sixtyDaysInSeconds = 5184000;
		app.use(
			helmet.hsts({
				maxAge: sixtyDaysInSeconds
			})
		);
		app.use(helmet.xssFilter());
	}
	app.use(helmet.frameguard({action: 'deny'}));
	app.use(cors({credentials: true}));

	// handle errors
	app.use(errorHandler);
	app.use(setLang);

	app.use(validateRequest);

	// parse application/json
	app.use(
		bodyParser({
			enableTypes: ['json'],
			onerror: err => {
				throw Boom.badRequest(err);
			}
		})
	);

	initPassport(app);
	// register routes
	app.use(health.routes(), health.allowedMethods());
	app.use(api.routes(), api.allowedMethods());

	app.use(
		api.allowedMethods({
			throw: true,
			notImplemented: () => Boom.notImplemented(),
			methodNotAllowed: () => Boom.methodNotAllowed()
		})
	);

	// XXX https://github.com/websockets/ws/pull/885#issue-187590719
	// path: '/websocket',
	// websockify(app, {
	//   server,
	//   noServer: true,
	//   clientTracking: true
	// });

	// // parse application/json
	// app.ws.use(
	//   bodyParser({
	//     enableTypes: ['json'],
	//     onerror: err => {
	//       throw Boom.badRequest(err);
	//     }
	//   })
	// );

	// app.ws.use(wsRouter.routes(), wsRouter.allowedMethods());
	wsAttach(app);

	// TODO add AMQ
	// eventBus.on('createMark', data => {
	//   // console.log('app.ws.server.clients');
	//   // console.log(app.ws.server.clients);
	//   if (app.ws.server.clients && app.ws.server.clients instanceof Set) {
	//     //console.log(app.ws.server.clients);
	//     app.ws.server.clients.forEach(client => {
	//       if (client.readyState === 1) {
	//         // console.log(client);
	//         client.send(JSON.stringify(data));
	//       }
	//     });
	//   }
	// });

	return app;
	// return http.createServer(app.callback());
}
