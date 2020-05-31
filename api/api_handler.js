require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const issue = require('./issue.js');

const candidate = require('./candidate.js');
const participant = require('./participant.js');
const election = require('./election.js');

const mailService = require('./mail_service.js');

const resolvers = {
  Query: {
    about: about.getMessage,
    issueList: issue.list,
    issue: issue.get,
    candidateList: candidate.list,
    participantList: participant.list,
    electionTitle: election.get,
    sendRegisterPublicKeysMail: mailService.sendRegisterKeyMail,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    issueAdd: issue.add,
    issueUpdate: issue.update,
    issueDelete: issue.delete,
    addCandiate: candidate.add,
    updateCandidate: candidate.update,
    removeCandidate: candidate.remove,
    addParticipant: participant.create,
    removeParticipant: participant.remove,
    updateParticipant: participant.update,
    updateElectionTitle: election.update,
  },
  GraphQLDate,
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
