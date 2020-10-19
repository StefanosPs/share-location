export default (on, config) => {
  process.env.SEQUELIZE_CONNECT = config.env.SEQUELIZE_CONNECT;
  process.env.DOTENV_CONFIG_PATH = config.env.DOTENV_CONFIG_PATH;
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

  return config;
};
