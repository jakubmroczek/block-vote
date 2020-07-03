module.exports = async (publicKey, { voterRepository, electionRepository }) => {
  const voter = await voterRepository.findByPublicKey(publicKey);
  const { electionIDs } = voter;
  const elections = [];
  // TODO: Add this functionalitites to the repositroy
  for (let index = 0; index < electionIDs.length; index++) {
    const id = electionIDs[index];
    const election = await electionRepository.get(id);
    elections.push(election);
  }
  return elections;
};
