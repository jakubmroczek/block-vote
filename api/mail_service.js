const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'jakubmroczek2@gmail.com',
  subject: 'Register your public key',
  html: '<p>Your html here</p>',
};

// TODO: Each user should have a unique link?
// TODO: Each user can only send email once
function sendRegisterKeyMail() {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return false;
    }
    console.log(info);
    return true;
  });
}

module.exports = {
  sendRegisterKeyMail,
};
