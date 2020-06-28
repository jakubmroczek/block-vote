require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const auth = require('../../infrastructure/webserver/auth.js');

const { mustBeSignedIn } = auth;

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

// TODO: Temporal resolvers - move this into a proper place
function _getElection(_, {}, { user, serviceLocator}) {
    console.log('hello get election');   
    console.log(serviceLocator)
    console.log(user);    
}

const resolvers = {
  Query: {
    getElection: mustBeSignedIn(_getElection),

    // listElection: mustBeSignedIn(election.list),

    // sendRegisterPublicKeysMail: mustBeSignedIn(mailService.sendRegisterKeyMail),

    // getVoterElection: voter.getElection,
  },
  Mutation: {
    // createElection: mustBeSignedIn(election.create),
    // updateElection: mustBeSignedIn(election.update),
    // removeElection: mustBeSignedIn(election.remove),

    // TODO: Make the api name the same as the resolver
    // registerPublicKey: voter.tryRegisterPublicKey,

    // setElectionIntoPublicKeyWaitingStage: mustBeSignedIn(election.setElectionInPublicKeyRegisterationStage),

    // deployElection: mustBeSignedIn(election.deployElection),

    // finishElection: mustBeSignedIn(election.finish),
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
