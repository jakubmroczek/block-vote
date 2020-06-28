/**
 * Returns the elections assigned to the public key.
 */
module.exports = (publicKey, { voterRepository, electionRepository }) => {
  // TODO: What if null
  const voter = voterRepository.getByPublicKey(publicKey);
  const { electionIDs } = voter;
  return electionRepository.list(electionIDs);
};
