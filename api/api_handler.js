require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { mustBeSignedIn } = require('./auth.js');

const election = require('./election.js');
const mailService = require('./mail_service.js');
const auth = require('./auth.js');
const voter = require('./voter.js');

function getContext({ req }) {
  const user = auth.getUser(req);
  // TODO: Fix this username mismatch
  const { email } = user;
  user.username = email;
  return { user };
}

const resolvers = {
  Query: {
    getElection: mustBeSignedIn(election.get),

    listElection: mustBeSignedIn(election.list),

    sendRegisterPublicKeysMail: mustBeSignedIn(mailService.sendRegisterKeyMail),

    getVoterElection: voter.getElection,
  },
  Mutation: {
    createElection: mustBeSignedIn(election.create),
    updateElection: mustBeSignedIn(election.update),
    removeElection: mustBeSignedIn(election.remove),

    // TODO: Make the api name the same as the resolver
    registerPublicKey: voter.tryRegisterPublicKey,

    setElectionIntoPublicKeyWaitingStage: mustBeSignedIn(election.setElectionInPublicKeyRegisterationStage),

    deployElection: mustBeSignedIn(election.deployElection),

    finishElection: mustBeSignedIn(election.finish),
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
