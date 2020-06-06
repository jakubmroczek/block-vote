const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const registerKeyMailTemplate = to => ({
  from: process.env.GMAIL_USER,
  to,
  subject: 'Register your public key',
  html: '<p>Czy masz ochotę na ostre myszowanie? Tylko tutaj HOT zdęcia naked myszunia</p>',
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
