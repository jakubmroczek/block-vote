'use strict';

const jwt = require('jsonwebtoken');

const AccessTokenManager = require('../../application/security/AccessTokenManager');

const { JWT_SECRET } = process.env;

module.exports = class extends AccessTokenManager {

  generate(payload) {
    return jwt.sign(payload, JWT_SECRET);
  }

  decode(accessToken) {
    return jwt.verify(accessToken, JWT_SECRET);
  }

};