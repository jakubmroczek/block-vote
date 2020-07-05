// TODO: Find a better place for me!
// TODO: Adjust me to the new architecture
const Router = require('express');
const bodyParser = require('body-parser');

const GetAccessToken = require('../../application/use_cases/GetAccessToken.js');
const VerifyGoogleOAuth2Token = require('../../application/use_cases/VerifyGoogleOAuth2Token.js');

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const CreateUser = require('../../application/use_cases/CreateUser.js');

const routes = new Router();

routes.use(bodyParser.json());

const { JWT_SECRET } = process.env;

function getUser(req) {
  const token = req.cookies.jwt;
  if (!token) {
    return { isLoggedIn: false };
  }

  try {
    const credentials = jwt.verify(token, JWT_SECRET);
    return credentials;
  } catch (error) {
    return { isLoggedIn: false };
  }
}

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

// TODO: Move to use cases ?
// TODO: Add support for email, instead of usernmae
async function isNewUser(email, { userRepository }) {
  const user = await userRepository.findByEmail(email);
  return user === null;
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
async function registerIfNewUser(credentials, serviceLocator) {
  const { email } = credentials;
  if (await isNewUser(email, serviceLocator)) {
    // TODO: Handle the database error
    await createNewUseAccount(email, serviceLocator);
  }
}

routes.post('/signin', async (req, res) => {
  const googleToken = req.body.google_token;
  
  const { app } = req;
  const { parent } = app;
  const { serviceLocator } = parent;

  if (!googleToken) {
    res.status(400).send({ code: 400, message: 'Missing Token' });
    return;
  }

  try {
    const credentials = await VerifyGoogleOAuth2Token(googleToken, serviceLocator);
    const token = GetAccessToken(credentials);
    res.cookie('jwt', token, { httpOnly: true });

    // TODO: Refactor this code, too many things does happen here
    // We use the email as the username
    //! !!! Email is the username
    await registerIfNewUser(credentials, serviceLocator);

    res.json(credentials);
  } catch (error) {
    res.status(403).send('Invalid credentials');
  }
});

routes.post('/signout', async (req, res) => {
  res.clearCookie('jwt');
  res.json({ status: 'ok' });
});

routes.post('/user', (req, res) => {
  res.send(getUser(req));
});

module.exports = { routes, getUser, mustBeSignedIn };
