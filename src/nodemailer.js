const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const getNodemailer = () => {
  let nodemailerTransport = null;

  const getTransport = () => {
    if (nodemailerTransport == null) {
      // nodemailerTransport = nodemailer.createTransport(
      //   sendgridTransport({
      //     auth: {
      //       api_key: process.env.SENDGRID_APIKEY,
      //     },
      //   })
      // );

      nodemailerTransport = nodemailer.createTransport({
        port: 465,
        host: "mail.privateemail.com",
        auth: {
          user: process.env.HOST_MAIL, //replace with your email
          pass: "21051993aA#1", //replace with your password
        },
      });
    }
    return nodemailerTransport;
  };

  return getTransport;
};

exports.getTransport = getNodemailer();
