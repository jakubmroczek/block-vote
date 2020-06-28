module.exports = async (user, { userRepository, electionRepository }) => {
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionIDs } = domainUser;
  // TODO: Introduce find here
  const elections = [];
  // map was not good because it return empty array, TODO: CHeck out for each  
  for (let i = 0; i < electionIDs.length; i+=1) {
    const id = electionIDs[i];
    const e = await electionRepository.get(id);
    elections.push(e);
  }  
  return elections;
};
