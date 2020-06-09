const Router = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

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

  res.json(credentials);
});

routes.post('/user', (req, res) => {
  res.send(getUser(req));
});

module.exports = { routes };
