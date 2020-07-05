const GetUser = require('../../application/use_cases/GetUser.js');
const CreateUser = require('../../application/use_cases/CreateUser.js');
const GetAccessToken = require('../../application/use_cases/GetAccessToken.js');
const VerifyAccessToken = require('../../application/use_cases/VerifyAccessToken.js');
const VerifyGoogleOAuth2Token = require('../../application/use_cases/VerifyGoogleOAuth2Token.js');

module.exports = {

  async signIn(request, response) {
    const googleToken = request.body.google_token;
    const { serviceLocator } = request.server.parent;

    if (!googleToken) {
      response.status(400).send({ code: 400, message: 'Missing Token' });
      return;
    }

    try {
      const credentials = await VerifyGoogleOAuth2Token(googleToken, serviceLocator);
      const token = GetAccessToken(credentials, serviceLocator);

      const { email } = credentials;
      const user = await GetUser(email, serviceLocator);
      if (user === null) {
        await CreateUser(email, serviceLocator);
      }

      response.cookie('jwt', token, { httpOnly: true });
      response.json(credentials);
    } catch (error) {
      console.log(error);
      response.status(403).send('Invalid credentials');
    }
  },

  signOut(request, response) {
    response.clearCookie('jwt');
    response.json({ status: 'ok' });
  },

  // TODO: Do I need this in this layer? Should not it be internals?
  verifyAccessToken(request) {
    const token = request.cookies.jwt;

    if (!token) {
      return { isLoggedIn: false };
    }

    try {
      // TODO: Do not catch the exception in this, layer. Maybe rethrow it
      // The layer above should handle thi
      const { serviceLocator } = request.server;
      const credentials = VerifyAccessToken(token, serviceLocator);
      return credentials;
    } catch (error) {
      // Maybe error is here? causing when client refreshes
      console.log(error);
      //TODO: Mismatch, in other I manipulate with the response, here I return something
      return { isLoggedIn: false };
    }
  },

  getUser(request, response) {
    const token = request.cookies.jwt;

    if (!token) {
      response.send({ isLoggedIn: false });
    }

    try {
      // TODO: Do not catch the exception in this, layer. Maybe rethrow it
      // The layer above should handle thi
      const { serviceLocator } = request.server;
      const credentials = VerifyAccessToken(token, serviceLocator);
      response.send(credentials);
    } catch (error) {
      // Maybe error is here? causing when client refreshes
      console.log(error);
      response.send({ isLoggedIn: false });
    }
  },

};
