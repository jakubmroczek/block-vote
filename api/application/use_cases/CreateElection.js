const Election = require('../../domain/Election.js');

module.exports = async (userContext, { userRepository, electionRepository }) => {
  const election = await electionRepository.persist(new Election(
    null,
    'New',
    '',
    [],
    [],
    [],
    null,
  ));
  const { id } = election;

  const { email } = userContext;
  const domainUser = await userRepository.findByEmail(email);
  domainUser.electionID = id;
  
  await userRepository.merge(domainUser);
  return election;
};
