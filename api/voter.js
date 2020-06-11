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

  // TODO: What if is undefined
  return participant;
}

async function verifySecretToken(electionID, secretToken) {
  // Read election
  const id = electionID;
  const electionDB = await election.get({}, { id });

  // Find participant having the secretToken
  const participant = getParticipant(electionDB, secretToken);

  // Check if participant is registered
  return isRegistered(participant) && secretTokenMatches(participant, secretToken);
}

// TODO: Change name or move to the election.js
function tryRegisterPublicKey(electionID, publicKey) {
  // Read election

  // Find particpant

  // Mark participatn as registered

  // Insert public key

  // return success
  return false;
}

function registerPublicKey(_, { electionID, secretToken, publicKey }) {
  return verifySecretToken(electionID, secretToken)
            && tryRegisterPublicKey(electionID, publicKey);
}

module.exports = { registerPublicKey };
