const Boom = require('@hapi/boom');
const GetAccessToken = require('../../application/use_cases/GetAccessToken');
const VerifyAccessToken = require('../../application/use_cases/VerifyAccessToken');

module.exports = {

  async getAccessToken_2(request, response) {
    const googleToken = request.body.google_token;
    if (!googleToken) {
      response.status(400).send({ code: 400, message: 'Missing Token' });
      return;
    }

    const client = new OAuth2Client();
    let payload;
    
    try {
      const ticket = await client.verifyIdToken({ idToken: googleToken });
      payload = ticket.getPayload();
    } catch (error) {
      response.status(403).send('Invalid credentials');
    }

    const { given_name: username, name, email } = payload;
    const credentials = {
      isLoggedIn: true, username, name, email,
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
  },


  async getAccessToken(request) {

    // Context
    const serviceLocator = request.server.app.serviceLocator;

    // Input
    const grantType = request.payload['grant_type'];
    const email = request.payload['username'];
    const password = request.payload['password'];

    if (!grantType || grantType !== 'password') {
      return Boom.badRequest('Invalid authentication strategy');
    }

    // Treatment
    try {
      const accessToken = await GetAccessToken(email, password, serviceLocator);

      // Output
      return accessToken;
    } catch (err) {
      return Boom.unauthorized('Bad credentials');
    }
  },

  verifyAccessToken(request, h) {

    // Context
    const serviceLocator = request.server.app.serviceLocator;

    // Input
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw Boom.badRequest('Missing or wrong Authorization request header', 'oauth');
    }
    const accessToken = authorizationHeader.replace(/Bearer/gi, '').replace(/ /g, '');

    // Treatment
    try {
      const { uid } = VerifyAccessToken(accessToken, serviceLocator);

      // Output
      return h.authenticated({
        credentials: { uid },
        artifacts: { accessToken: accessToken }
      });
    } catch (err) {
      return Boom.unauthorized('Bad credentials');
    }
  },

};