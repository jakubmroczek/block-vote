require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const election = require('./election.js');
const mailService = require('./mail_service.js');

const resolvers = {
  Query: {
    getElection: election.get,
    listElection: election.list,

    sendRegisterPublicKeysMail: mailService.sendRegisterKeyMail,
  },
  Mutation: {
    createElection: election.create,
    updateElection: election.update,
    removeElection: election.remove,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
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
