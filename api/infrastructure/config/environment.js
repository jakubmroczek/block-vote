require('dotenv').config();
const constants = require('./constants');

/**
 * This module centralize all the environment variables of the application. Thanks to this module, there MUST NOT be any
 * `process.env` instruction in any other file or module.
 */
module.exports = (() => {
  const environment = {
    database: {
      dialect: constants.SUPPORTED_DATABASE.MONGO,
      url: process.env.DB_URL,
    },

    server: {
      port: process.env.API_SERVER_PORT,
      enableCors: process.env.ENABLE_CORS,
    },

    frontend: {
      server: {
        url: process.env.UI_VOTING_ENDPOINT,
      },
    },

    mail: {
      service: constants.SUPPORTED_MAIL_SERVICE.GMAIL,
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASSWORD,
    },

    blockchain: {
      httpProvider: {
        url: process.env.BLOCKCHAIN_HTTP_PROVIDER_URL,
      },
    },
  };

  if (process.env.NODE_ENV === 'test') {
    // TODO: Looks that I deleted the IN_MEMORY db
    environment.database = {
      driver: constants.SUPPORTED_DATABASE.IN_MEMORY,
    };
  }

  return environment;
})();
