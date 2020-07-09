const GetUser = require('../../application/use_cases/GetUser.js');
const CreateUser = require('../../application/use_cases/CreateUser.js');
const GetAccessToken = require('../../application/use_cases/GetAccessToken.js');
const VerifyGoogleOAuth2Token = require('../../application/use_cases/VerifyGoogleOAuth2Token.js');
const VerifyAccessToken = require('../../application/use_cases/VerifyAccessToken.js');

//TODO: Make this a use-case
// eslint-disable-next-line no-underscore-dangle
function _getUser(request, serviceLocator) {
  const token = request.cookies.jwt;
  if (!token) {
    return { signedIn: false };
  }

  try {
    const user = VerifyAccessToken(token, serviceLocator);
    return user;
  } catch (error) {
    return { signedIn: false, email: '' };
  }
}

module.exports = {

  async signIn(request, response) {
    const googleToken = request.body.google_token;
    const { serviceLocator } = request.app.parent;

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

  getUser(request, response) {
    const { serviceLocator } = request.app.parent;
    response.send(_getUser(request, serviceLocator));
  },

};
