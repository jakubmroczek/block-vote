require('dotenv').config();
const election = require('./election.js');

function secretTokenMatches(participant, secretToken) {
  return participant.secretToken === secretToken;
}

function isRegistered(participant) {
  // TODO: Fix this, this field should be present just when the participant is created
  const { registered } = participant;
  if (registered === undefined) {
    return false;
  }
  return registered;
}

// TODO: Better name than electionDB
function getParticipant(electionDB, secretToken) {
  const { participants } = electionDB;
  const participant = participants.find(p => p.secretToken === secretToken);
  return participant;
}

async function verifySecretToken(id, secretToken) {
  // Read election
  const electionDB = await election.get({}, { id });

  // Find participant having the secretToken
  const participant = getParticipant(electionDB, secretToken);

  if (participant === undefined) {
    return false;
  }

  return !isRegistered(participant) && secretTokenMatches(participant, secretToken);
}

// TODO: Change name or move to the election.js
async function tryRegisterPublicKey(id, secretToken, publicKey) {
  // Read election
  const electionDB = await election.get({}, { id });

  // Find participant having the secretToken
  // Must exists because this method is called second
  const participant = getParticipant(electionDB, secretToken);

  // TODO: Unsure if this really works
  const { participants } = electionDB;
  const newParticpant = { ...participant, publicKey, registered: true };
  const index = participants.indexOf(participant);
  participants[index] = newParticpant;
  const changes = { participants };

  //   TODO: Handle issue when the database was not handled correctly
  await election.update({}, { id, changes });
  return true;
}

async function registerPublicKey(_, { electionID, secretToken, publicKey }) {
  const id = electionID;
  const succes = (await verifySecretToken(id, secretToken)) && (await tryRegisterPublicKey(id, secretToken, publicKey));
  return succes;
}

module.exports = { registerPublicKey };
