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

function generateMail(participant) {
  const { email, secretToken } = participant;
  // TODO: From where to we take the voting link?
  const link = 'very-dumy-link';
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

function mailEveryone(participants) {
  const mails = participants.map(generateMail);

  mails.forEach((mail) => {
    sendEmail(mail);
  });

  // TODO: Fix this, introducde better erorr handling
  return true;
}

// TODO: Each user should have a unique link?
async function sendRegisterKeyMail(_, { id }) {
  const electionDB = await election.get({}, { id });
  const { participants } = electionDB;

  return mailEveryone(participants);
}

module.exports = {
  sendRegisterKeyMail,
};
