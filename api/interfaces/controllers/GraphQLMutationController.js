/* eslint-disable no-underscore-dangle */
const CreateElection = require('../../application/use_cases/CreateElection.js');
const UpdateElection = require('../../application/use_cases/UpdateElection.js');
const RegisterPublicKey = require('../../application/use_cases/RegisterPublicKey.js');
const SetElectionInRegisteration = require('../../application/use_cases/SetElectionInRegisteration.js');
const CompileElectionSmartContract = require('../../application/use_cases/CompileElectionSmartContract.js');
const FinishElection = require('../../application/use_cases/FinishElection.js');
const { mustBeSignedIn, mustOwnElection } = require('../../infrastructure/security/GraphQLAuthentication.js');

async function _createElection(_1, _2, { user, serviceLocator }) {
  const election = await CreateElection(user, serviceLocator);
  return election;
}

async function _updateElection(_1, { id, changes }, { serviceLocator }) {
  const election = await UpdateElection(id, changes, serviceLocator);
  return election;
}

async function _registerPublicKey(_1, { id, secretToken, publicKey }, { serviceLocator }) {
  //   TODO: Error handlin
  const result = await RegisterPublicKey(secretToken, publicKey, id, serviceLocator);
  return result;
}

// TODO: Rename me!
async function _setElectionInPublicKeyRegisterationStage(_1, { id }, { serviceLocator }) {
  const result = await SetElectionInRegisteration(id, serviceLocator);
  return result;
}

async function _compileElectionSmartContract(_1, { id }, { serviceLocator }) {
  // TODO: Error handling
  const result = await CompileElectionSmartContract(id, serviceLocator);
  return result;
}

async function _finishElection(_1, _2, { user, serviceLocator }) {
  // TODO: Error handling
  const result = await FinishElection(user, serviceLocator);
  return result;
}

module.exports = {
  createElection: mustBeSignedIn(_createElection),
  updateElection: mustBeSignedIn(mustOwnElection(_updateElection)),
  registerPublicKey: _registerPublicKey,
  setElectionIntoPublicKeyWaitingStage: mustBeSignedIn(mustOwnElection(_setElectionInPublicKeyRegisterationStage)),
  compileElectionSmartContract: mustBeSignedIn(mustOwnElection(_compileElectionSmartContract)),
  finishElection: mustBeSignedIn(_finishElection),
};
