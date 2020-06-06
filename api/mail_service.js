const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// TODO: Take this from the UI server / graphql query parameter
const htmlForm = '<p>Register your Ethereum public key here: <a href="http://localhost:8000/panel/key">Register your vote here mate</a></p>';

const registerKeyMailTemplate = to => ({
  from: process.env.GMAIL_USER,
  to,
  subject: 'Register your public key',
  html: htmlForm,
});

// TODO: Each user should have a unique link?
// TODO: Each user can only send email once
async function sendRegisterKeyMail(_, { to }) {
  const receivers = to.join();
  const mailOptions = registerKeyMailTemplate(receivers);
  transporter.sendMail(mailOptions, (error /* info */) => {
    if (error) {
      // TOOD: Logging
      return false;
    }
    // TOOD: Logging
    return true;
  });

  // TODO: Fix this, introducde better erorr handling
  return true;
}

module.exports = {
  sendRegisterKeyMail,
};
