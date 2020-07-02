const nodemailer = require('nodemailer');
// Remove this, use constants
require('dotenv').config();

// TODO: Get this from the constants
const transporter = nodemailer.createTransport({

  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const mailTemplate = (to, subject, html) => ({
  from: process.env.GMAIL_USER,
  to,
  subject,
  html,
});

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

// TODO: Get the candidates from the different repo or different use case.
module.exports = async (electionID, candidates, { electionRepository }) => {
  // TODO: Introduce better template
  const html = `<p>The election hosted on the Ethereum blockchain results: <br> ${candidates} </p>`;
  // TODO: Add info about the elction title
  const subject = 'The election results';

  const election = await electionRepository.get(electionID);
  const { participants } = election;

  participants.forEach((p) => {
    const mail = mailTemplate(p.email, subject, html);
    sendEmail(mail);
  });

  // TODO; Error handling
  return true;
};
