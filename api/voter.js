require('dotenv').config();
const election = require('./election.js');
// TODO: Rename the whole module to voter
const publicKeyDB = require('./public_keys.js');

function isSecretTokenValid(electionObj, secretToken) {
  const { secretTokens } = electionObj;
  const match = secretTokens.find(t => t === secretToken);
  return match !== undefined;
}

// TODO: Move to the service layer
async function registerPublicKey(electionObj, secretToken, publicKey) {
  const { _id: id } = electionObj;

  const { secretTokens, publicKeys } = electionObj;

  // Token was used, removing it
  const index = secretTokens.indexOf(secretToken);
  if (index > -1) {
    secretTokens.splice(index, 1);
  }

  // Updating the public keys
  publicKeys.push(publicKey);

  //TODO: Support for multiple elections
  await publicKeyDB.create(publicKey, id);

  const changes = { secretTokens, publicKeys };

  //   TODO: Handle issue when the database was not handled correctly
  await election.update({}, { id, changes });

  return true;
}

async function tryRegisterPublicKey(_, { electionID, secretToken, publicKey }) {
  const id = electionID;
  const electionObj = await election.get({}, { id });

  // TODO: What if eleciton does not exist
  if (electionObj === null) {
    return false;
  }

  if (isSecretTokenValid(electionObj, secretToken)) {
    // TODO: Error hadling    
    await registerPublicKey(electionObj, secretToken, publicKey);
    return true;
  }
    
  return false;
}

// TODO: When rewriting to the 3 layered architecutre remove me
async function getElection(_, { publicKey }) {
  // TODO: What if null
  const pK = await publicKeyDB.get(publicKey);

  // TODO: In the future support for the multiple elections
  const id = pK.electionIDs;

  // eslint-disable-next-line no-shadow
  const electionDB = await election.get({}, { id });

  return electionDB;
}

module.exports = { tryRegisterPublicKey, getElection };
