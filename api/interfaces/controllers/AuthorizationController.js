const GetAccessToken = require('../../application/use_cases/GetAccessToken.js');
const VerifyAccessToken = require('../../application/use_cases/VerifyAccessToken.js');
const VerifyGoogleOAuth2Token = require('../../application/use_cases/VerifyGoogleOAuth2Token.js');
const CreateUser = require('../../application/use_cases/CreateUser.js');

module.exports = {

  async getAccessToken(request, response) {
    const googleToken = request.body.google_token;
    const { serviceLocator } = request.app.parent;
    
    if (!googleToken) {
      response.status(400).send({ code: 400, message: 'Missing Token' });
      return;
    }

    try {
      const credentials = await VerifyGoogleOAuth2Token(googleToken, serviceLocator);
      const token = GetAccessToken(credentials, serviceLocator);
      
      response.cookie('jwt', token, { httpOnly: true });

      // TODO: Refactor this code, too many things does happen here
      // We use the email as the username
      //! !!! Email is the username
      await registerIfNewUser(credentials, serviceLocator);

      response.json(credentials);
    } catch (error) {
      console.log(error);
      response.status(403).send('Invalid credentials');
    }
  },

  verifyAccessToken(request) {
    const token = request.cookies.jwt;
  
    if (!token) {
      return { isLoggedIn: false };
    }
  
    try {
      const { serviceLocator } = request.app;
      const credentials = VerifyAccessToken(token, serviceLocator);
      return credentials;
    } catch (error) {
      // Maybe error is here? causing when client refreshes
      console.log(error);
      return { isLoggedIn: false };
    }
  },

};
