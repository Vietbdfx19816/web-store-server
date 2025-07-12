const path = require('path');
const pug = require('pug');

// setup nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_MAIL_USER,
    pass: process.env.NODE_MAIL_PASSWORD,
  },
});

const sendMail = ({
  template: templateName,
  templateVars,
  ...resOfOptions
}) => {
  const templatePath = path.join(__dirname, '..', 'template', templateName);
  const options = {
    from: process.env.NODE_MAIL_USER,
    ...resOfOptions,
  };

  const html = pug.renderFile(templatePath, templateVars);
  options.html = html;

  return transporter.sendMail(options);
};

module.exports.sendMail = sendMail;
