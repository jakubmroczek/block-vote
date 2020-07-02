const Election = require('../../domain/Election.js');

// TODO: Decide where the async fucntion should be stored - controller vs use case
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

  //TODO: Highliht what exact user it is -> not domain level, imporve what is right now.
  const { email } = userContext;
  const user = await userRepository.findByEmail(email);
  user.electionID = id;
  
  // TODO: Check if success
  await userRepository.merge(user);
  return election;
};
