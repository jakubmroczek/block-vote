const express = require('express');
const cookieParser = require('cookie-parser');

// TODO: Export this an an anonymous function
const { installHandler } = require('../../interfaces/controllers/GraphQLController.js');

// TODO: Move this to a proper place, right now it is because I do not have a better idea.
const auth = require('../webserver/auth.js');

const createServer = async () => {
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