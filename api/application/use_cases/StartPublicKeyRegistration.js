const generator = require('generate-password');
// TODO: I do not know if this is a good architecture?
// TODO: Should this be a distinct use_case or not?

// Ensures that there is no conflicts between tokens
// TODO: Move this to own use case
function generateSecretTokens(quantity) {
  let i = quantity;
  const secretTokens = [];
  while (i > 0) {
    const secretToken = generator.generate({
      // TODO: Move this to constatnt: SECRET_TOKEN_LENGTH
      length: 32,
      numbers: true,
    });
    const index = secretTokens.indexOf(secretToken);
    if (index === -1) {
      i -= 1;
      secretTokens.push(secretToken);
    }
  }
  return secretTokens;
}


module.exports = async (electionID, { electionRepository }) => {
  const election = await electionRepository.get(electionID);

  const { participants } = election;
  const { length } = participants;

  election.status = 'Registration';
  election.secretTokens = generateSecretTokens(length);

  const result = await electionRepository.merge(election);
  // TODO: What do I exactly return?
  return result;
};
