'use strict';

const constants = require('./constants');

/**
 * This module centralize all the environment variables of the application. Thanks to this module, there MUST NOT be any
 * `process.env` instruction in any other file or module.
 */
module.exports = (() => {

  const environment = {
    database: {
      dialect: constants.SUPPORTED_DATABASE.MONGO,
      //TODO: Add this to constants?
      url: process.env.DATABASE_URI 
    }
  };

  if (process.env.NODE_ENV === 'test') {
    //TODO: Looks that I deleted the IN_MEMORY db
    environment.database = {
      driver: constants.SUPPORTED_DATABASE.IN_MEMORY
    }
  }

  return environment;
})();
