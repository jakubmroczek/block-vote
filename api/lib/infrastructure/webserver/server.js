'use strict';

const Hapi = require('@hapi/hapi');
const Good = require('@hapi/good');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Blipp = require('blipp');
const HapiSwagger = require('hapi-swagger');
const Package = require('../../../package');

const createServer = async () => {
  require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');
const auth = require('./auth.js');
  const app = express();
  app.use(cookieParser());
  
  app.use('/auth', auth.routes);

  // Register custom plugins
  // graohql plugins
  installHandler(app);

  app.serviceLocator = require('../../infrastructure/config/service-locator');

  return app;
};

module.exports = createServer;