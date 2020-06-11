require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { mustBeSignedIn } = require('./auth.js');

const user = require('./user.js');
const election = require('./election.js');
const mailService = require('./mail_service.js');
const auth = require('./auth.js');

function getContext({ req }) {
  // eslint-disable-next-line no-shadow
  const user = auth.getUser(req);
  // TODO: Fix this username mismatch
  const { email } = user;
  user.username = email;
  return { user };
}

const resolvers = {
  Query: {
    getUser: mustBeSignedIn(user.get),

    getElection: mustBeSignedIn(election.get),
    listElection: mustBeSignedIn(election.list),

    sendRegisterPublicKeysMail: mustBeSignedIn(mailService.sendRegisterKeyMail),
  },
  Mutation: {
    createElection: mustBeSignedIn(election.create),
    updateElection: mustBeSignedIn(election.update),
    removeElection: mustBeSignedIn(election.remove),
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };
