const express = require('express');
const cookieParser = require('cookie-parser');

// TODO: Export this an an anonymous function
const GraphQL = require('../../interfaces/routes/graphql.js');
const Authorization = require('../../interfaces/routes/authorization.js');

const createServer = async () => {
  const server = express();
  server.use(cookieParser());

  GraphQL.register(server);
  Authorization.register(server);

  server.serviceLocator = require('../../infrastructure/config/service-locator');

  return server;
};

module.exports = createServer;