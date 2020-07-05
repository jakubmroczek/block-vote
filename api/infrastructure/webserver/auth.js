const AuthorizationController = require('../../interfaces/AuthorizationController.js')
const UserController = require('../../interfaces/UserController.js')

// TODO: Find a better place for me!
// TODO: Adjust me to the new architecture
const Router = require('express');
const bodyParser = require('body-parser');

const { AuthenticationError } = require('apollo-server-express');

const routes = new Router();

routes.use(bodyParser.json());

function mustBeSignedIn(resolver) {
  return (root, args, context) => {
    const { user } = context;
    if (!user || !user.isLoggedIn) {
      console.log(user);
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, context);
  };
}

routes.post('/user/create', async (req, res) => {
  //TODO: Should I return something in response?
  await UserController.createUser(req);
});

routes.post('/signin', async (req, res) => {
  await AuthorizationController.getAccessToken(req, res);
});

routes.post('/signout', async (req, res) => {
  res.clearCookie('jwt');
  res.json({ status: 'ok' });
});

routes.post('/user', (req, res) => {
  res.send(getUser(req));
});

module.exports = { routes, mustBeSignedIn };
