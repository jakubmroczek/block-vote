require('dotenv').config();
const election = require('./election.js');

function secretTokenMatches(participant, secretToken) {
  return participant.secretToken === secretToken;
}

function isRegistered(participant) {
  return participant.isRegistered;
}

// TODO: Better name than electionDB
function getParticipant(electionDB, secretToken) {
  const { participants } = election;

  const participant = participants.find(p => p.secretToken === secretToken);

  return participant;
}

async function verifySecretToken(electionID, secretToken) {
  // Read election
  const id = electionID;
  const electionDB = await election.get({}, { id });

  // Find participant having the secretToken
  const participant = getParticipant(electionDB, secretToken);

  if (participant === undefined) {
    return false;
  }

  // Check if participant is registered
  return isRegistered(participant) && secretTokenMatches(participant, secretToken);
}

// TODO: Change name or move to the election.js
async function tryRegisterPublicKey(electionID, secretToken, publicKey) {
  // Read election
  const id = electionID;
  const electionDB = await election.get({}, { id });

  // Find participant having the secretToken
  // Must exists
  const participant = getParticipant(electionDB, secretToken);

  // TODO: Unsure if this really works
  const { participants } = electionDB;
  const newParticpant = { ...participant, publicKey };
  const index = participants.indexOf(participant);
  participants[index] = newParticpant;
  const { changes } = participants;

  //   TODO: How to check if it was succesful?
  await election.update({}, { id, changes });

  return false;
}

function registerPublicKey(_, { electionID, secretToken, publicKey }) {
  return verifySecretToken(electionID, secretToken)
            && tryRegisterPublicKey(electionID, secretToken, publicKey);
}

module.exports = { registerPublicKey };
