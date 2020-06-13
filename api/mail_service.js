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

const mailTemplate = (to, html) => ({
  from: process.env.GMAIL_USER,
  to,
  subject: 'Register your public key',
  html,
});

function generateMail(participant, link) {
  const { email, secretToken } = participant;
  // TODO: From where to we take the voting link?
  const html = htmlForm(link, secretToken);
  return mailTemplate(email, html);
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

function mailEveryone(participants, link) {
  const mails = participants.map(p => generateMail(p, link));

  mails.forEach((mail) => {
    sendEmail(mail);
  });

  // TODO: Fix this, introducde better erorr handling
  return true;
}

// TODO: Each user should have a unique link?
async function sendRegisterKeyMail(_, { id }) {
  const electionDB = await election.get({}, { id });
  const { _id, participants } = electionDB;
  
  // TODO: Move it to the distinct service
  const link = process.env.UI_VOTING_ENDPOINT + _id;

  return mailEveryone(participants, link);
}

module.exports = {
  sendRegisterKeyMail,
};
