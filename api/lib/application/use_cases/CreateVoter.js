const Voter = require('../../domain/Voter.js');

module.exports = (publicKey, electionIDs, { voterRepository }) => {
  const voter = new Voter(null, publicKey, electionIDs);
  return voterRepository.persist(voter);
};
