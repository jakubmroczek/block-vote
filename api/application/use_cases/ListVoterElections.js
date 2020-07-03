module.exports = async (publicKey, { voterRepository, electionRepository }) => {
  //TODO: What if voter was not found
  const voter = await voterRepository.findByPublicKey(publicKey);
  const { electionIDs } = voter;
  const elections = [];

  // TODO: Add this functionalitites to the repositroy
  for (let index = 0; index < electionIDs.length; index += 1) {
    const id = electionIDs[index];
    const election = await electionRepository.get(id);

    if (election !== null) {
      elections.push(election);
    }
  }

  return elections;
};
