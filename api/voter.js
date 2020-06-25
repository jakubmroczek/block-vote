require('dotenv').config();
const election = require('./election.js');
//TODO: Rename the whole module to voter
const publicKeyDB = require('./public_keys.js');

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
  const electionDB = await election.get({}, { id });

  // Find participant having the secretToken
  // Must exists because this method is called second
  const participant = getParticipant(electionDB, secretToken);

  const { participants, publicKeys } = electionDB;
  //TODO: Remove the extra fields form the participant, use distinct array for the secrets
  const newParticpant = { ...participant, publicKey, registered: true };
  const index = participants.indexOf(participant);
  participants[index] = newParticpant;
  publicKeys.push(publicKey);

  // Updating the public keys
  // TODO: Change the identifier so that it can be faster.

  // TODO: Update the number of registered keys by one
  await publicKeyDB.create(publicKey, id);
  
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

//TODO: When rewriting to the 3 layered architecutre remove me
async function getElection(_, { publicKey }) {
  //TODO: What if null
  const pK = await publicKeyDB.get(publicKey);

  //TODO: In the future support for the multiple elections
  const id = pK.electionIDs;

  // eslint-disable-next-line no-shadow
  const electionDB = await election.get({}, { id });
  
  return electionDB;
}

module.exports = { registerPublicKey, getElection };
