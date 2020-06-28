// TODO: Find a better place for me!
// TODO: Adjust me to the new architecture
const Router = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const CreateUser = require('../../application/use_cases/CreateUser.js');

const routes = new Router();

routes.use(bodyParser.json());

const { JWT_SECRET } = process.env;

function getUser(req) {
  const token = req.cookies.jwt;
  if (!token) {
    return { signedIn: false };
  }

  try {
    const credentials = jwt.verify(token, JWT_SECRET);
    return credentials;
  } catch (error) {
    return { signedIn: false };
  }
}

function mustBeSignedIn(resolver) {
  return (root, args, context) => {
    const { user } = context;
    if (!user || !user.signedIn) {
      console.log(user);
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, context);
  };
}

// TODO: Move to use cases ?
// TODO: Add support for email, instead of usernmae
async function isNewUser(email, { userRepository }) {
  const user = await userRepository.findByEmail(email);
  const userExists = (user.id === null);
  return userExists;
}

// TODO: Move to usep cases or controller?
// TODO: Add support for email, instead of usernmae
// TODO: Get serviceLocator here
async function createNewUseAccount(email, { userRepository }) {
  // TODO: Move me to a proper layer
  // TODO: Error handling?  
  const domainUser = await CreateUser(email, { userRepository });  
  return domainUser;
}

// TODO: I do not like this name
async function registerIfNewUser(username, serviceLocator) {
  if (await isNewUser(username, serviceLocator)) {
    // TODO: Handle the database error
    await createNewUseAccount(username, serviceLocator);
  }
}

routes.post('/signin', async (req, res) => {
  const googleToken = req.body.google_token;
  if (!googleToken) {
    res.status(400).send({ code: 400, message: 'Missing Token' });
    return;
  }
  const client = new OAuth2Client();
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: googleToken });
    payload = ticket.getPayload();
  } catch (error) {
    res.status(403).send('Invalid credentials');
  }
  const { given_name: username, name, email } = payload;
  const credentials = {
    signedIn: true, username, name, email,
  };
  const token = jwt.sign(credentials, JWT_SECRET);
  res.cookie('jwt', token, { httpOnly: true });

  // TODO: Refactor this code, too many things does happen here
  // We use the email as the username
  //! !!! Email is the username
  const { app } = req;
  const { parent } = app;
  const { serviceLocator } = parent;
  await registerIfNewUser(email, serviceLocator);

  res.json(credentials);
});

routes.post('/signout', async (req, res) => {
  res.clearCookie('jwt');
  res.json({ status: 'ok' });
});

routes.post('/user', (req, res) => {
  res.send(getUser(req));
});

module.exports = { routes, getUser, mustBeSignedIn };
