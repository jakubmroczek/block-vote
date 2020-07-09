
const Router = require('express');
const bodyParser = require('body-parser');
const AuthorizationController = require('../../interfaces/controllers/AuthorizationController.js');

const routes = new Router();
routes.use(bodyParser.json());

routes.post('/signin', async (request, response) => {
  await AuthorizationController.signIn(request, response);
});

routes.post('/signout', async (request, response) => {
  AuthorizationController.signOut(request, response);
});

routes.post('/user', (request, response) => {
  AuthorizationController.getUser(request, response);
});

const register = (server) => {
  server.use('/auth', routes);
};

module.exports = { register };
