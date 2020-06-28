module.exports = async (user, { userRepository, electionRepository }) => {
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionIDs } = domainUser;
  // TODO: Introduce find here
  const elections = [];
  electionIDs.map(async (id) => {
    const e = await electionRepository.get(id);
    elections.push(e);
  });
  return elections;
};
