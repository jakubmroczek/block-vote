module.exports = (user, { electionRepsitory }) => {
  const email = { user };
  return electionRepsitory.findByEmail(email);
};
