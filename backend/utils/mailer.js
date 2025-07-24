require('dotenv').config();

const nodemailer = require('nodemailer');

const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const emailAlert = async ({ subject, text }) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject,
      text,
    });
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

module.exports = emailAlert;
