const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const getNodemailer = () => {
  let nodemailerTransport = null;

  const getTransport = () => {
    if (nodemailerTransport == null) {
      nodemailerTransport = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_key: process.env.SENDGRID_APIKEY,
          },
        })
      );
    }
    return nodemailerTransport;
  };

  return getTransport;
};

exports.getTransport = getNodemailer();
