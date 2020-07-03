module.exports = async (id, { electionRepository }) => {
  // TODO: What if null
  const election = await electionRepository.get(id);

  //TODO: Keep magic strings in one file
  if (election.status !== 'Deployed') {
    return null;
  }

  return election;
};
