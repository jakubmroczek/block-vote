const User = require('../../domain/User');

module.exports = (email, { userRepository }) => {
  const electionIDs = [];
  const user = new User(null, email, electionIDs);
  return userRepository.persist(user);
};
