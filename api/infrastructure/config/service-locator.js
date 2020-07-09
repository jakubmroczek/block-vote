const constants = require('./constants');
const environment = require('./environment');
const JwtAccessTokenManager = require('../security/JwtAccessTokenManager');
const UserSerializer = require('../../interfaces/serializers/UserSerializer');

function buildBeans() {

  const beans = {
    accessTokenManager: new JwtAccessTokenManager(),
    userSerializer: new UserSerializer(),
  };

  const UserRepositoryMongo = require('../repositories/UserRepositoryMongo.js');
  beans.userRepository = new UserRepositoryMongo();

  const ElectionRepositoryMongo = require('../repositories/ElectionRepositoryMongo.js')
  beans.electionRepository = new ElectionRepositoryMongo();

  const VoterRepositoryMongo = require('../repositories/VoterRepositoryMongo.js')
  beans.voterRepository = new VoterRepositoryMongo();

  const BlockchainRepositoryEthereum = require('../repositories/BlockchainRepositoryEthereum.js')
  beans.blockchainRepository = new BlockchainRepositoryEthereum();

  return beans;
}

module.exports = buildBeans();
