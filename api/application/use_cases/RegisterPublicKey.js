const Voter = require('../../domain/Voter.js');

function isSecretTokenValid(secretToken, election) {
  const { secretTokens } = election;
  const match = secretTokens.find(token => token === secretToken);
  return match !== undefined;
}

// TODO: electionIDs is a one string, but in the future it wil be an array
module.exports = async (secretToken, publicKey, id, { voterRepository, electionRepository }) => {
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

  // TODO: Is this correct? I mean if the voter does not exist, will we return null?
  // TODO: Read in DDD if I can reuse a use case here
  let voter = await voterRepository.findByPublicKey(publicKey);

  if (voter === null) {
    const electionIDs = [id];
    voter = new Voter(null, publicKey, electionIDs);  
    await voterRepository.persist(voter);
  } else {
    voter.electionIDs.push(id);
    await voterRepository.merge(voter);
  }

  return true; 
};
