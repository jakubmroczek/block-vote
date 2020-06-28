//TODO: Find a better place for me!
//TODO: Adjust me to the new architecture
const Router = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

// const user = require('./user.js');

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
  return (root, args, { user }) => {
    if (!user || !user.signedIn) {
      console.log(user);
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, { user });
  };
}

async function isNewUser(username) {
    // TODO: Move me to a proper layer
    return false;
//   const dbUser = await user.get(username);
//   return dbUser === null;
}

async function createNewUseAccount(username) {
    // TODO: Move me to a proper layer
    // TODO: Implemment me!
    //   const dbUser = await user.create(username);
//   return dbUser;
}

// TODO: I do not like this name
async function registerIfNewUser(username) {
  if (await isNewUser(username)) {
    // TODO: Handle the database error
    await createNewUseAccount(username);
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
  await registerIfNewUser(email);

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
