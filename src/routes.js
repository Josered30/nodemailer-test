const nodemailer = require("nodemailer");
const { Router } = require("express");
const { getTransport } = require("./nodemailer");

const router = Router();

router.route("/").post(async (req, res) => {
  const { email } = req.body;
  const transport = await getTransport();
  // send mail with defined transport object
  let info = await transport.sendMail({
    from: process.env.HOST_MAIL, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  res.send("Sended");
});

module.exports = router;
