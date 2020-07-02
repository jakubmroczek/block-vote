const User = require('../../domain/User');

module.exports = (email, { userRepository }) => {
  const user = new User(null, email, null, []);
  return userRepository.persist(user);
};
