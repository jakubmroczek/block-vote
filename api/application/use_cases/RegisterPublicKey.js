const Voter = require('../../domain/Voter.js');

function isSecretTokenValid(secretToken, election) {
  const { secretTokens } = election;
  const match = secretTokens.find(token => token === secretToken);
  return match !== undefined;
}

// TODO: electionIDs is a one string, but in the future it wil be an array
module.exports = async (secretToken, publicKey, id, { voterRepository, electionRepository }) => {
  const voter = new Voter(null, publicKey, id);  
  const election = await electionRepository.get(id);

  // Unsure if this should be in this layer
  if (!isSecretTokenValid(secretToken, election)) {
    throw "Invalid secret token, rejecting public key";
  }

  //I must remove the secret tokens from the election
  // TODO: Veryfing if I correctly poped the keys
  const index = election.secretTokens.indexOf(secretToken);
  if (index > -1) {
    election.secretTokens.splice(index, 1);
  }
  election.publicKeys.push(publicKey);

  await electionRepository.merge(election);

  //TODO: Error handling
  await voterRepository.persist(voter);

  return true; 
};
