const Election = require('../../domain/Election.js');

// TODO: Decide where the async fucntion should be stored - controller vs use case
module.exports = async (user, { userRepository, electionRepository }) => {
  const election = await electionRepository.perist(new Election(
    null,
    'New',
    '',
    [],
    [],
    [],
    null,
  ));
  const { _id } = election;
  user.electionIDs.push(_id);
  const result = await userRepository.merge(user);
  return result;
};
