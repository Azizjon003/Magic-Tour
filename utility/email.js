const nodemailer = require("nodemailer");

const mail = async (options) => {
  // 1) transporterni yaratish

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // 2) email optionlari

  const mailOptions = {
    from: `AliqulovAzizjon <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) email yuborish
  await transporter.sendMail(mailOptions);
};

module.exports = mail;
