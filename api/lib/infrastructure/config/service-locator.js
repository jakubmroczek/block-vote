'use strict';

const constants = require('./constants');
const environment = require('./environment');
const JwtAccessTokenManager = require('../security/JwtAccessTokenManager');
const UserSerializer = require('../../interfaces/serializers/UserSerializer');

function buildBeans() {

  const beans = {
    accessTokenManager: new JwtAccessTokenManager(),
    userSerializer: new UserSerializer(),
  };

  const UserRepositoryMongo = require('../repositories/UserRepositoryMongo');
  beans.userRepository = new UserRepositoryMongo();

  return beans;
}

module.exports = buildBeans();
