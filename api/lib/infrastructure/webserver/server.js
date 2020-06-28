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