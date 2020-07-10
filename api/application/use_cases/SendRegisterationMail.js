const SendMail = require('./SendMail.js');
const environment = require('../../infrastructure/config/environment.js');

const htmlTemplate = (link, secretToken) => `
     <p>
      The voting will be on Ethereum.
      Register your Ethereum public through this link
      <a href="${link}">${link}</a>
      Your very secret token is: ${secretToken}
      </p>
`;

module.exports = async (electionID, { electionRepository }) => {
  // TODO: Error handlind
  const election = await electionRepository.get(electionID);

  const { id: _id, participants, secretTokens } = election;

  const link = environment.frontend.server.url + _id;

  if (participants.length !== secretTokens.length) {
    // TODO: Handle the error if there is not enough public keys
    throw 'Not enough secret tokens generated for the public key';
  }

  const { length } = participants;
  const subject = 'Register your public key';

  for (let i = 0; i < length; i += 1) {
    const { email } = participants[i];
    const secretToken = secretTokens[i];
    const html = htmlTemplate(link, secretToken);

    await SendMail(email, subject, html);
  }


  // TODO: Fix this, introducde better erorr handling
  return true;
};
