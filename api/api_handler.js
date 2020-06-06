require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const candidate = require('./candidate.js');
const participant = require('./participant.js');
const election = require('./election.js');
const mailService = require('./mail_service.js');

const resolvers = {
  Query: {
    candidateList: candidate.list,
    participantList: participant.list,
    electionTitle: election.get,
    sendRegisterPublicKeysMail: mailService.sendRegisterKeyMail,
  },
  Mutation: {
    addCandiate: candidate.add,
    updateCandidate: candidate.update,
    removeCandidate: candidate.remove,
    addParticipant: participant.create,
    removeParticipant: participant.remove,
    updateParticipant: participant.update,
    updateElectionTitle: election.update,
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
