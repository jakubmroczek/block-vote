/* eslint-disable no-underscore-dangle */

// Use cases
const GetUserElection = require('../../application/use_cases/GetUserElection.js');
const SendRegisterationMail = require('../../application/use_cases/SendRegisterationMail.js');

// TODO: Consider rename, along with the frontend code
const GetVoterElection = require('../../application/use_cases/GetVoterElection.js');
const ListVoterElections = require('../../application/use_cases/ListVoterElections.js');
const { mustBeSignedIn, mustOwnElection } = require('../../infrastructure/security/GraphQLAuthentication.js');

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
  getUserElection: mustBeSignedIn(_getUserElection),
  // TODO: This should be rather moved to plain REST
  sendRegisterPublicKeysMail: mustBeSignedIn(mustOwnElection(_sendRegisterPublicKeysMail)),
  getVoterElection: _getVoterElection,
  listVoterElections: _listVoterElections,
};
