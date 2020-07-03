module.exports = async (id, { electionRepository }) => {
  // TODO: What if null
  return electionRepository.get(id);
};
