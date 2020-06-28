module.exports = async (email, { userRepository }) => {
  const domainUser = await userRepository.findByEmail(email);
  return domainUser;
};
