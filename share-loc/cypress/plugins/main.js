// import DB from '../../src/data/proxy/';

export default (on, config) => {
  process.env.SEQUELIZE_CONNECT = config.env.SEQUELIZE_CONNECT;
  process.env.DOTENV_CONFIG_PATH = config.env.DOTENV_CONFIG_PATH;
  process.env.USER_SERVICE_URL = config.env.USER_SERVICE_URL;
  process.env.NODE_ENV = 'test';

  const DBproxy = require('../../src/data/proxy/').default;
  const DB = require('../../src/data/sequelize/').default;

  const users = [];
  // process.env.NODE_ENV="test";

  // let envVars = require('dotenv').config({path: '.env.test'});
  // if (envVars.parsed !== undefined) {
  //   process.env = {...process.env, ...envVars.parsed};
  // }

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // on('file:preprocessor', cypressEslint());
  // on('file:preprocessor', cypressEslint(cypressBabelEsX()));
  // on('file:preprocessor', cypressBabelEsX());
  on('task', {
    // deconstruct the individual properties
    seedUserDB() {
      return DBproxy.getUser({})
        .then(async el => {
          if (!el || el.data.length < 1) {
            console.log('Innnnnn');
            return Promise.resolve();
          }
          console.log('Out');
          const users = el.data;
          const res = [];
          for (let index = 0; index < users.length; index++) {
            const item = users[index];
            // console.log(`Delete User$ ${item.id}`);
            res.push(DBproxy.deleteUser({id: item.id}));
          }

          return Promise.all(res);
          // return .finally(() => null);
        })
        .then(() => {
          const initialItems = [
            {
              fullName: 'full name 1',
              username: 'username1',
              password: 'p2ssword',
              role: 'USER',
              status: 'ACTIVE',
              emails: ['mail01@gmail.com', 'mail02@gmail.com']
            },
            {
              fullName: 'full name 2',
              username: 'username2',
              password: 'p2ssword',
              role: 'USER',
              status: 'ACTIVE',
              emails: ['mail01@gmail.com', 'mail02@gmail.com']
            },
            {
              fullName: 'full name 3',
              username: 'username3',
              password: 'p2ssword',
              role: 'USER',
              status: 'ACTIVE',
              emails: ['mail01@gmail.com', 'mail02@gmail.com']
            }
          ];
          const res = [];
          for (let index = 0; index < initialItems.length; index += 1) {
            const item = initialItems[index];
            res.push(DBproxy.createUser(item));
          }
          return res;
        })
        .then(res => {
          res.forEach(el => {
            users.push(el);
          });
          return null;
        });
    },
    seedMarkDB() {
      return DB.getMark()
        .then(marks => {
          const req = [];
          for (let index = 0; index < marks.length; index += 1) {
            req.push(DB.deleteMark(marks[index].userId));
          }
          for (let index = 0; index < users.length; index += 1) {
            const element = users[index];
            req.push(
              DB.createUpdateMark(element.id, {lat: 37 + Math.random(), lng: 23 + Math.random()})
            );
          }

          return req;
        })
        .then(() => null);
    }
  });

  return config;
};
