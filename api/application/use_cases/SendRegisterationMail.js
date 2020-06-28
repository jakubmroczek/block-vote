const nodemailer = require('nodemailer');
//Remove this, use constants
require('dotenv').config();

// TODO: Get this from the constants
const transporter = nodemailer.createTransport({

  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// TODO: Take this from the UI server / graphql query parameter
const htmlForm = (link, secretToken) => `
     <p>
      Register your Ethereum public through this link
      <a href="${link}">${link}</a>
      Your very secret token is: ${secretToken} 
      </p>
`;

const mailTemplate = (to, subject, html) => ({
  from: process.env.GMAIL_USER,
  to,
  subject,
  html,
});

function generateMail(participant, secretToken, link) {
  const { email } = participant;
  // TODO: From where to we take the voting link?
  const html = htmlForm(link, secretToken);
  const subject = 'Register your public key';
  return mailTemplate(email, subject, html);
}

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error /* info */) => {
    if (error) {
      // TOOD: Logging
      return false;
    }
    // TOOD: Logging
    return true;
  });
}

function mailEveryone(_id, participants, secretTokens) {
  const link = process.env.UI_VOTING_ENDPOINT + _id;

  if (participants.length !== secretTokens.length) {
    // TODO: Handle the error if there is not enough public keys
    throw 'Not enugh secret tokens generated for the public key';
  }

  const { length } = participants;
  const mails = [];
  for (let i = 0; i < length; i += 1) {
    const participant = participants[i];
    const secretToken = secretTokens[i];
    mails.push(generateMail(participant, secretToken, link));
  }

  mails.forEach((mail) => {
    sendEmail(mail);
  });

  // TODO: Fix this, introducde better erorr handling
  return true;
}

module.exports = async (electionID, { electionRepository }) => {
  // TODO: Error handlind
  const election = await electionRepository.get(electionID);
  const { id, participants, secretTokens } = election;

  return mailEveryone(id, participants, secretTokens);
};
