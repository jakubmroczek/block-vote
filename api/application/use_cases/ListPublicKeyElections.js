/**
 * Returns the elections assigned to the public key.
 */
module.exports = async (publicKey, { voterRepository, electionRepository }) => {
  // TODO: What if null
  const voter = await voterRepository.findByPublicKey(publicKey);
  const { electionIDs } = voter;
  
  // TODO: Rename to find
  // TODO: In the future support for the multiple elecgnios at a time  
  return electionRepository.get(electionIDs);
};
