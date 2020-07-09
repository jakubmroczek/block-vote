/* eslint-disable no-underscore-dangle */
const { AuthenticationError } = require('apollo-server-express');

// Use cases
const GetElection = require('../../application/use_cases/GetElection.js');
const GetUserElection = require('../../application/use_cases/GetUserElection.js');
const SendRegisterationMail = require('../../application/use_cases/SendRegisterationMail.js');

// TODO: Consider rename, along with the frontend code
const GetVoterElection = require('../../application/use_cases/GetVoterElection.js');
const ListVoterElections = require('../../application/use_cases/ListVoterElections.js');
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

async function _getElection(_1, { id }, { serviceLocator }) {
  // TODO: What if not found
  const election = await GetElection(id, serviceLocator);
  return election;
}

async function _getUserElection(_1, _2, { user, serviceLocator }) {
// TODO: shoul this be a domain user?
  const elections = await GetUserElection(user, serviceLocator);
  return elections;
}

async function _sendRegisterPublicKeysMail(_1, { id }, { serviceLocator }) {
// TODO: What if error
// TODO: shoul this be a domain user?
  const response = await SendRegisterationMail(id, serviceLocator);
  return response;
}

async function _getVoterElection(_1, { id }, { serviceLocator }) {
// TODO: What if not found
  const election = await GetVoterElection(id, serviceLocator);
  return election;
}

async function _listVoterElections(_1, { publicKey }, { serviceLocator }) {
// // TODO: What if not found
  const elections = await ListVoterElections(publicKey, serviceLocator);
  return elections;
}

module.exports = {
  getElection: _mustBeSignedIn(_mustOwnElection(_getElection)),
  getUserElection: _mustBeSignedIn(_getUserElection),
  // TODO: This should be rather moved to plain REST
  sendRegisterPublicKeysMail: _mustBeSignedIn(_mustOwnElection(_sendRegisterPublicKeysMail)),
  getVoterElection: _getVoterElection,
  listVoterElections: _listVoterElections,
};
