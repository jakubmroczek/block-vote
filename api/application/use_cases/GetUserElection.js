module.exports = async (user, { userRepository, electionRepository }) => {
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionID } = domainUser;
  const election = await electionRepository.get(electionID);
  return election;
};
