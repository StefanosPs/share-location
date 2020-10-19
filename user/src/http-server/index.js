import Koa from 'koa';
import http from 'http';
import Boom from '@hapi/boom';
import pino from 'koa-pino-logger';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import errorHandler from './middleware/errorHandler';
import setLang from './middleware/setLang';
import health from './health';
import api from './api';

const inProduction = process.env.NODE_ENV === 'production';

export default function createServer({commandBus} = {}) {
	if (!commandBus) {
		throw new Error('server: commandBus is missing');
	}

	const app = new Koa();

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

	// handle errors
	app.use(errorHandler);
	app.use(setLang);

	// parse application/json
	app.use(
		bodyParser({
			enableTypes: ['json'],
			onerror: err => {
				throw Boom.badRequest(err);
			}
		})
	);
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

	return http.createServer(app.callback());
}
