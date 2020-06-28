require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const auth = require('../../infrastructure/webserver/auth.js');

const { mustBeSignedIn } = auth;

// Use cases
const GetElection = require('../../application/use_cases/GetElection.js');
const ListUserElections = require('../../application/use_cases/ListUserElections.js');
const SendRegisterationMail = require('../../application/use_cases/SendRegisterationMail.js');
// TODO: Consider rename, along with the frontend code
const ListPublicKeyElections = require('../../application/use_cases/ListPublicKeyElections.js');
const CreateElection = require('../../application/use_cases/CreateElection.js');
const UpdateElection = require('../../application/use_cases/UpdateElection.js');
const RegisterPublicKey = require('../../application/use_cases/RegisterPublicKey.js');
const SetElectionInRegisteration = require('../../application/use_cases/SetElectionInRegisteration.js');
const DeployElectionOnBlockchain = require('../../application/use_cases/DeployElectionOnBlockchain.js');
const FinishElection = require('../../application/use_cases/FinishElection.js');

// TODO: Where should I get from this context?
function getContext({ req }) {
  const user = auth.getUser(req);
  // TODO: Fix this username mismatch
  const { email } = user;
  user.username = email;
  const { app } = req;
  const { serviceLocator } = app;
  return { user, serviceLocator };
}

// TODO: Add extra checks so that user can not query election that are not theirs
function mustOwnElection(resolver) {
  return (root, args, context) => {
    // The election id
    const { id } = args;
    const { user } = context;

    // TODO: Add use case to check if the owner owns the election

    return resolver(root, args, context);
  };
}

// TODO: Temporal resolvers - move this into a proper place
async function getElection(_1, { id }, { user, serviceLocator }) {
  // TODO: What if not found
  const election = await GetElection(id, serviceLocator);
  return election;
}

async function listElection(_1, _2, { user, serviceLocator }) {
  // TODO: What if not found
  // TODO: shoul this be a domain user?
  const elections = await ListUserElections(user, serviceLocator);    
  return elections;
}

async function sendRegisterationMail(_1, { id }, { user, serviceLocator }) {
  // TODO: What if error
  // TODO: shoul this be a domain user?
  const response = await SendRegisterationMail(id, serviceLocator);
  return response;
}

// TODO: Check if there is no problem with the contexts
async function listPublicKeyElections(_1, { publicKey }, { serviceLocator }) {
  // TODO: What if not found
  const election = await ListPublicKeyElections(publicKey, serviceLocator);  
  return election;
}

// Mutations

async function createElection(_1, _2, { user, serviceLocator }) {
  const election = await CreateElection(user, serviceLocator);    
  return election;
}

async function updateElection(_1, { id, changes }, { user, serviceLocator }) {
  const election = await UpdateElection(id, changes, serviceLocator);
  return election;
}

async function registerPublicKey(_1, { id, secretToken, publicKey }, { user, serviceLocator }) {
  //   TODO: Error handlin
  const result = await RegisterPublicKey(secretToken, publicKey, id, serviceLocator);
  return result;
}

// TODO: Rename me!
async function setElectionInPublicKeyRegisterationStage(_1, { id }, { user, serviceLocator }) {
  const result = await SetElectionInRegisteration(id, serviceLocator);
  return result;
}

async function deployElection(_1, { id }, { user, serviceLocator }) {
  // TODO: Error handling
  const result = await DeployElectionOnBlockchain(id, serviceLocator);
  return result;
}

async function finish(_1, { id }, { user, serviceLocator }) {
  // TODO: Error handling
  const result = await FinishElection(id, serviceLocator);  
  return result;
}

const resolvers = {
  Query: {
    getElection: mustBeSignedIn(getElection),

    listElection: mustBeSignedIn(listElection),

    sendRegisterPublicKeysMail: mustBeSignedIn(sendRegisterationMail),

    getVoterElection: listPublicKeyElections,
  },
  Mutation: {
    createElection: mustBeSignedIn(createElection),

    updateElection: mustBeSignedIn(updateElection),

    // TODO: Make the api name the same as the resolver
    registerPublicKey,

    setElectionIntoPublicKeyWaitingStage: mustBeSignedIn(setElectionInPublicKeyRegisterationStage),

    deployElection: mustBeSignedIn(deployElection),

    finishElection: mustBeSignedIn(finish),
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
