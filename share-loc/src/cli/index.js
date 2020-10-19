import 'dotenv/config';
// import logger from 'logger';

import program from 'commander';
import EventEmitter from 'events';

import CommandBus from 'domain/commandBus';
import Registry from 'domain/registry';

import * as DB from 'data/sequelize';

const registry = new Registry({
	eventBus: new EventEmitter(),
	dB: DB
});
const commandBus = new CommandBus({registry});

// async function user({cmd, opt}) {
// 	console.log("here");
// 	await new Promise(resolve => setImmediate(resolve, 1000));
// }

program
	.command('user  <subcommand> ')
	.description('Manage Users')
	.option('')
	.option('create', 'Create deployment')
	.option('-u, --username <username>', 'The user name')
	.option('-p, --password <password>', 'The password')
	.option('')
	.option('get', 'Get thw user ')
	.option('--id <id>', 'The user name', 0)
	.action(async (subcommand, args) => {
		
		// switch (subcommand) {
		// 	case 'create':
		// 		command = CreateUserCommand.buildFromJSON({
		// 			username: args.username,
		// 			password: args.password,
		// 			provider: '',
		// 			familyName: '',
		// 			givenName: '',
		// 			emails: ''
		// 		});

		// 		await commandBus.execute(command);
		// 		break;
		// 	case 'get':
		// 		command = GetUserCommand.buildFromJSON({
		// 			id: parseInt(args.id, 10)
		// 		});
		// 		await commandBus.execute(command);
		// 		break;
		// 	default:
		// 		logger.error(`error: unknown command '${command}'`);
		// 		process.exitCode = 1;
		// 		break;
		// }
	});

program
	.command('login')
	.description('login')
	.option('-u, --username <username>', 'The user name')
	.option('-p, --password <password>', 'The password')
	.action(async args => {
		const command = CheckUserPassCommand.buildFromJSON({
			username: args.username,
			password: args.password
		});

		await commandBus.execute(command);
	});

program.parse(process.argv);
