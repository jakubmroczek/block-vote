require('dotenv').config();
const election = require('./election.js');

function verifySecretToken(electionID, secretToken) {
  // Read election

  // Find participant having the secretToken

  // Check if participant is registered 

  // Check if the tokens matches

  // if matches return true else false

  return false;
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
