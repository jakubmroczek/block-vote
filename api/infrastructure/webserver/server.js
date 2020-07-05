const express = require('express');

// TODO: Export this an an anonymous function
const { installHandler } = require('../../interfaces/controllers/GraphQLController.js');

// TODO: Move this to a proper place, right now it is because I do not have a better idea.
const Authorization = require('../../interfaces/routes/authorization.js');

const createServer = async () => {
  const server = express();
  
  // TODO: Rename to register
  installHandler(server);
  Authorization.register(server);

  server.serviceLocator = require('../../infrastructure/config/service-locator');

  return server;
};

module.exports = createServer;