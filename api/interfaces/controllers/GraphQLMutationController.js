/* eslint-disable no-underscore-dangle */
const CreateElection = require('../../application/use_cases/CreateElection.js');
const UpdateElection = require('../../application/use_cases/UpdateElection.js');
const RegisterPublicKey = require('../../application/use_cases/RegisterPublicKey.js');
const StartPublicKeyRegistration = require('../../application/use_cases/StartPublicKeyRegistration.js');
const CompileElectionSmartContract = require('../../application/use_cases/CompileElectionSmartContract.js');
const FinishElection = require('../../application/use_cases/FinishElection.js');
const SendRegisterationMail = require('../../application/use_cases/SendRegisterationMail.js');
const GetUserElection = require('../../application/use_cases/GetUserElection.js');
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

async function _startPublicKeyRegistration(_1, _2, { user, serviceLocator }) {
  const election = await GetUserElection(user, serviceLocator);
  const { id } = election;
  
  // TODO: Error handling
  await StartPublicKeyRegistration(id, serviceLocator);
  await SendRegisterationMail(id, serviceLocator);

  return true;
}

async function _compileElectionSmartContract(_1, _2, { user, serviceLocator }) {
  const election = await GetUserElection(user, serviceLocator);
  const { id } = election;
  
  // TODO: Error handling
  await CompileElectionSmartContract(id, serviceLocator);
  
  return true;
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
  startPublicKeyRegistration: mustBeSignedIn(_startPublicKeyRegistration),
  compileElectionSmartContract: mustBeSignedIn(_compileElectionSmartContract),
  finishElection: mustBeSignedIn(_finishElection),
};
