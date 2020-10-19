import 'dotenv/config';
// import logger from 'logger';

import program from 'commander';
import EventEmitter from 'events';

import CommandBus from 'domain/commandBus';
import Registry from 'domain/registry';

import CreateUserCommand from 'domain/user/post/command';
import GetUserCommand from 'domain/user/get/command';
import CheckUserPassCommand from 'domain/user/check-user-pass/command';

import DB from 'data/sequelize';

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
		let command;
		switch (subcommand) {
			case 'create':
				console.log(args);
				command = CreateUserCommand.buildFromJSON({
					username: args.username,
					password: args.password,
					provider: '',
					familyName: '',
					givenName: '',
					emails: ''
				});

				await commandBus.execute(command);
				break;
			case 'get':
				command = GetUserCommand.buildFromJSON({
					id: parseInt(args.id, 10)
				});
				await commandBus.execute(command);
				break;
			default:
				console.error(`error: unknown command '${command}'`);
				process.exitCode = 1;
				break;
		}

		// console.log(command, cmd);
		// await new Promise(resolve => setImmediate(resolve, 1000));
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

		const res = await commandBus.execute(command);
		console.log(res);
	});
/* 
	.action(async cmd => {
		const createUser = CreateUserCommand.buildFromJSON({
			username: cmd.username,
			password: cmd.password,
			provider: '',
			familyName: '',
			givenName: '',
			emails: ''
		});

		await commandBus.execute(createUser);
	})
	
program
	// .command('getUser [id]', 'Get the list of the users')
	.command(`getUser`)
	//
	.action(async cmd => {
		const getUser = GetUserCommand.buildFromJSON({
			id: parseInt(cmd.id)
		});
		// const getUser = GetUserCommand.buildFromJSON();
		console.log(getUser);
		await commandBus.execute(getUser); 
	})
	.parse(process.argv);

// program
//   .command('start <service>', 'start named service')
//   .command('stop [service]', 'stop named service, or all if no name supplied');
// program
//   .usage('-s <shared folder>')
//   .description('Provide a two-way connection between the local computer and Remix IDE')
//   .option('--remix-ide  <url>', 'URL of remix instance allowed to connect to this web sockect connection')
//   .option('-s, --shared-folder <path>', 'Folder to share with Remix IDE')
//   .option('--read-only', 'Treat shared folder as read-only (experimental)')
//   .on('--help', function(){
//     console.log('\nExample:\n\n    remixd -s ./ --remix-ide http://localhost:8080')
//   })
//   .action(async cmd => {
//     // const createOrder = CreateOrderCommand.buildFromJSON({
//     //   pizzaType: cmd.pizzaType,
//     //   pizzaSize: cmd.pizzaSize,
//     //   quantity: cmd.quantity
//     // });
//     await commandBus.execute(createOrder);
//   });
 */
program.parse(process.argv);
