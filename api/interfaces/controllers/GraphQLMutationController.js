/* eslint-disable no-underscore-dangle */
const { AuthenticationError } = require('apollo-server-express');

const CreateElection = require('../../application/use_cases/CreateElection.js');
const UpdateElection = require('../../application/use_cases/UpdateElection.js');
const RegisterPublicKey = require('../../application/use_cases/RegisterPublicKey.js');
const SetElectionInRegisteration = require('../../application/use_cases/SetElectionInRegisteration.js');
const CompileElectionSmartContract = require('../../application/use_cases/CompileElectionSmartContract.js');
const FinishElection = require('../../application/use_cases/FinishElection.js');
const GetUser = require('../../application/use_cases/GetUser.js');

function _mustBeSignedIn(resolver) {
  return (root, args, context) => {
    const { user } = context;
    if (!user || !user.isLoggedIn) {
      console.log(user);
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, context);
  };
}

function _mustOwnElection(resolver) {
  return async (root, args, context) => {
    const { id } = args;
    const { user, serviceLocator } = context;

    const { email } = user;
    const domainUser = await GetUser(email, serviceLocator);

    const isOnwer = domainUser.electionID === id;
    if (!isOnwer) {
      throw new AuthenticationError(`Election ${id} is not owned by ${email}, thus they can not read/update it.`);
    }

    return resolver(root, args, context);
  };
}

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
  createElection: _mustBeSignedIn(_createElection),
  updateElection: _mustBeSignedIn(_mustOwnElection(_updateElection)),
  registerPublicKey: _registerPublicKey,
  setElectionIntoPublicKeyWaitingStage: _mustBeSignedIn(_mustOwnElection(_setElectionInPublicKeyRegisterationStage)),
  compileElectionSmartContract: _mustBeSignedIn(_mustOwnElection(_compileElectionSmartContract)),
  finishElection: _mustBeSignedIn(_finishElection),
};
