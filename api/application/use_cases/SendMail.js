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

module.exports = async (to, subject, content) => {
  const mail = mailTemplate(to, subject, content);
  sendEmail(mail);

  // TODO; Error handling
  return true;
};
