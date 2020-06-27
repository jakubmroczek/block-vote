const nodemailer = require('nodemailer');
const election = require('./election.js');
require('dotenv').config();

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

function mailEveryone(participants, secretTokens, link) {
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

// TODO: Each user should have a unique link?
async function sendRegisterKeyMail(_, { id }) {
  const electionDB = await election.get({}, { id });
  const { _id, participants, secretTokens } = electionDB;

  // TODO: Move it to the distinct service
  const link = process.env.UI_VOTING_ENDPOINT + _id;

  return mailEveryone(participants, secretTokens, link);
}

// Candidates the candidates from the blockchain along with their vote counters
// TODO: Pass the election title here
async function sendElectionFinishMail(election, candidates) {
  // TODO: Introduce better template
  const html = `<p>The election results: <br> ${candidates} </p>`;
  // TODO: Add info about the elction title
  const subject = 'The election results';

  const { participants } = election;

  participants.forEach((p) => {
    const mail = mailTemplate(p.email, subject, html);
    sendEmail(mail);
  });

  // TODO; Error handling
  return true;
}

module.exports = {
  sendRegisterKeyMail,
  sendElectionFinishMail,
};
