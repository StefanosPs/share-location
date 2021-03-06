import EventEmitter from 'events';
import 'dotenv/config';
// import {Server as WebSocketServer} from 'ws';

import DBSequelize from 'data/sequelize/';
import DBProxy from 'data/proxy/';
import logger from './logger';

import createHttpServer from './http-server';

import CommandBus from './domain/commandBus';
import Registry from './domain/registry';

// import rabbit from '../config/rabbitmq';
// import Broker from './broker';

const DB = {...DBSequelize, ...DBProxy};

const NODE_ENV = process.env.NODE_ENV || 'development';

// CommandBus
const commandBus = new CommandBus({
	registry: new Registry({
		eventBus: new EventEmitter(),
		dB: DB
	})
});

async function terminate() {
	// shut down adapters one by one
	logger.info('Closing RabbitMQ connections...');
	// await rabbit.disconnect();
	process.exit(1);
}

logger.info('Launching service in %s mode...', NODE_ENV);

// Broker
// rabbit.connect().then(() => {
//   logger.info('Connected to RabbitMQ broker');
//   const broker = new Broker(rabbit, commandBus);
//   broker.start();
//   rabbit.once('reconnect', () => {
//     setTimeout(() => broker.start(), 0);
//   });
// });

// HTTP server
const port = process.env.HTTP_PORT || 3000;

const server = createHttpServer({commandBus});

server.listen(port);
server.on('error', error => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	switch (error.code) {
		case 'EACCES':
			logger.error(`Port ${port} requires elevated privileges`);
			terminate();
			break;
		case 'EADDRINUSE':
			logger.error(`Port ${port} is already in use`);
			terminate();
			break;
		default:
			throw error;
	}
});
server.on('listening', () => {
	logger.info(`HTTP server listening at http://127.0.0.1:${port}`);
});

// Process termination
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
	process.once(signal, () => {
		logger.error('Received %s - terminating process...', signal);
		terminate();
	});
});

process.on('exit', () => logger.info('Process terminated'));
