require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const { AuthenticationError } = require('apollo-server-express');
const auth = require('../../infrastructure/webserver/auth.js');

const { mustBeSignedIn } = auth;

// Use cases
const GetElection = require('../../application/use_cases/GetElection.js');
const GetUserElection = require('../../application/use_cases/GetUserElection.js');
const SendRegisterationMail = require('../../application/use_cases/SendRegisterationMail.js');
// TODO: Consider rename, along with the frontend code
const GetVoterElection = require('../../application/use_cases/GetVoterElection.js');
const ListVoterElections = require('../../application/use_cases/ListVoterElections.js');
const CreateElection = require('../../application/use_cases/CreateElection.js');
const UpdateElection = require('../../application/use_cases/UpdateElection.js');
const RegisterPublicKey = require('../../application/use_cases/RegisterPublicKey.js');
const SetElectionInRegisteration = require('../../application/use_cases/SetElectionInRegisteration.js');
const CompileElectionSmartContract = require('../../application/use_cases/CompileElectionSmartContract.js');
const FinishElection = require('../../application/use_cases/FinishElection.js');
const GetUser = require('../../application/use_cases/GetUser.js');

// TODO: Not sure if this should be here
const AuthorizationController = require('./AuthorizationController.js');

// TODO: Where should I get from this context?
function getContext({ req }) {
  console.log(req.headers)
  const user = AuthorizationController.verifyAccessToken(req);
  const { serviceLocator } = req.app;
  return { user, serviceLocator };
}

// TODO: Add extra checks so that user can not query election that are not theirs
function mustOwnElection(resolver) {
  return async (root, args, context) => {
    // The election id
    const { id } = args;
    const { user, serviceLocator } = context;

    // TODO: Make it a use case to check if the owner owns the election
    const { email } = user;
    const domainUser = await GetUser(email, serviceLocator);
1
    const isOnwer = domainUser.electionID === id;
    if (!isOnwer) {
      console.log(domainUser);
      throw new AuthenticationError('User can not read election not owned by them.');
    }

    return resolver(root, args, context);
  };
}

// TODO: Temporal resolvers - move this into a proper place
async function getElection(_1, { id }, { serviceLocator }) {
  // TODO: What if not found
  const election = await GetElection(id, serviceLocator);
  return election;
}

async function getUserElection(_1, _2, { user, serviceLocator }) {
  // TODO: shoul this be a domain user?
  const elections = await GetUserElection(user, serviceLocator);
  return elections;
}

async function sendRegisterationMail(_1, { id }, { serviceLocator }) {
  // TODO: What if error
  // TODO: shoul this be a domain user?
  const response = await SendRegisterationMail(id, serviceLocator);
  return response;
}

async function getVoterElection(_1, { id }, { serviceLocator }) {
  // TODO: What if not found
  const election = await GetVoterElection(id, serviceLocator);
  return election;
}

async function listVoterElections(_1, { publicKey }, { serviceLocator }) {
  // // TODO: What if not found
  const elections = await ListVoterElections(publicKey, serviceLocator);
  return elections;
}

// Mutations

async function createElection(_1, _2, { user, serviceLocator }) {
  const election = await CreateElection(user, serviceLocator);    
  return election;
}

async function updateElection(_1, { id, changes }, { serviceLocator }) {
  const election = await UpdateElection(id, changes, serviceLocator);
  return election;
}

async function registerPublicKey(_1, { id, secretToken, publicKey }, { serviceLocator }) {
  //   TODO: Error handlin
  const result = await RegisterPublicKey(secretToken, publicKey, id, serviceLocator);
  return result;
}

// TODO: Rename me!
async function setElectionInPublicKeyRegisterationStage(_1, { id }, { serviceLocator }) {
  const result = await SetElectionInRegisteration(id, serviceLocator);
  return result;
}

async function compileElectionSmartContract(_1, { id }, { serviceLocator }) {
  // TODO: Error handling
  const result = await CompileElectionSmartContract(id, serviceLocator);
  return result;
}

async function finishElection(_1, _2, { user, serviceLocator }) {
  // TODO: Error handling
  const result = await FinishElection(user, serviceLocator);
  return result;
}

const resolvers = {
  Query: {
    getElection: mustBeSignedIn(mustOwnElection(getElection)),

    getUserElection: mustBeSignedIn(getUserElection),

    sendRegisterPublicKeysMail: mustBeSignedIn(mustOwnElection(sendRegisterationMail)),

    listVoterElections,

    getVoterElection,
  },
  Mutation: {
    createElection: mustBeSignedIn(createElection),

    updateElection: mustBeSignedIn(mustOwnElection(updateElection)),

    // TODO: Make the api name the same as the resolver
    registerPublicKey,

    setElectionIntoPublicKeyWaitingStage: mustBeSignedIn(mustOwnElection(setElectionInPublicKeyRegisterationStage)),

    compileElectionSmartContract: mustBeSignedIn(mustOwnElection(compileElectionSmartContract)),

    finishElection: mustBeSignedIn(finishElection),
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    console.log(error.extensions.exception.stacktrace);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };
