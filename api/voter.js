require('dotenv').config();
const election = require('./election.js');

const { getDb } = require('./db.js');

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

  const { participants, publicKeys, normalizedPublicKeys } = electionDB;
  const newParticpant = { ...participant, publicKey, registered: true };
  const index = participants.indexOf(participant);
  participants[index] = newParticpant;

  // Updating the public keys
  // TODO: Change the identifier so that it can be faster.
  publicKeys.push(publicKey);
  const normalizedPublicKey = publicKey.toLowerCase();
  normalizedPublicKeys.push(normalizedPublicKey);

  const changes = { participants, publicKeys };

  //   TODO: Handle issue when the database was not handled correctly
  await election.update({}, { id, changes });

  // Add to the public key public key
  return true;
}

async function registerPublicKey(_, { electionID, secretToken, publicKey }) {
  const id = electionID;
  const succes = (await verifySecretToken(id, secretToken)) && (await tryRegisterPublicKey(id, secretToken, publicKey));
  return succes;
}

async function getElection(_, { publicKey }) {
  const db = getDb();
  const normalizedPublicKeys = publicKey.toLowerCase();
  const filter = { normalizedPublicKeys: { $all: [normalizedPublicKeys] } };
  const collection = 'elections';
  // eslint-disable-next-line no-shadow
  const election = await db.collection(collection).findOne(filter);
  return election;
}

module.exports = { registerPublicKey, getElection };
