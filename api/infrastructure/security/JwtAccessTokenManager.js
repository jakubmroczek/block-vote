const jwt = require('jsonwebtoken');

// TODO: Get this from the evnironment
const { JWT_SECRET } = process.env;

module.exports = class  {

  generate(payload) {
    return jwt.sign(payload, JWT_SECRET);
  }

  decode(accessToken) {
    return jwt.verify(accessToken, JWT_SECRET);
  }

};