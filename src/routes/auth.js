const { Router } = require("express");
const crypto = require("crypto");

const User = require("../models/user");
const Token = require("../models/token");
const { getTransport } = require("../nodemailer");

const router = Router();

router.route("/signin").post(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    // user is not found in database i.e. user is not registered yet.
    if (!user) {
      return res.status(401).json({
        message: `The email address ${req.body.email} is not associated with any account. please check and try again!`,
      });
    }

    const validate = await user.validatePassword(password);
    // comapre user's password if user is find in above step
    if (!validate) {
      return res.status(401).json({ message: "Wrong Password!" });
    }

    // check user is verified or not
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Your Email has not been verified. Please click on resend",
      });
    }

    return res.status(200).json({ message: "User successfully logged in." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.route("/signup").post(async (req, res) => {
  const { email, password } = req.body;

  const exist = await User.exists({ email: email });
  if (exist) {
    return res.status(500).json({ message: "User already exist" });
  }

  try {
    const user = new User({
      email: email,
      password: password,
    });

    user.password = await user.encryptPassword(user.password);
    const newUser = await user.save();

    const token = new Token({
      _userId: newUser._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();

    const transport = await getTransport();
    // send mail with defined transport object
    const link = `http://${req.headers.host}/api/auth/confirmation/${token.token}`;
    console.log(link);

    let info = await transport.sendMail({
      from: process.env.HOST_MAIL, // sender address
      to: email, // list of receivers
      subject: "Email confirmation", // Subject line
      text: `Hello \n\nPlease verify your account by clicking the link: \n${link} \nThank You!\n`,
    });

    console.log("Message sent: %s", info);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return res.json({
      email: newUser.email,
      id: newUser.id,
      message: "User created",
    });
  } catch (e) {
    return res.status(500).json({ message: "Error creating user" });
  }
});

router.route("/confirmation/:token").get(async (req, res) => {
  const token = await Token.findOne({ token: req.params.token });

  if (!token) {
    return res.status(400).json({
      messsage:
        "Your verification link may have expired. Please click on resend for verify your Email.",
    });
  }

  const user = await User.findById(token._userId);

  if (!user) {
    return res.status(401).json({
      message:
        "We were unable to find a user for this verification. Please SignUp!",
    });
  }

  if (user.isVerified) {
    return res.status(200).json({
      message: "User has been already verified. Please Login",
    });
  }

  try {
    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "Your account has been successfully verified" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.route("/resend").post(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user.isVerified) {
      return res.status(200).json({
        message: "User has been already verified. Please Login",
      });
    }

    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();

    const transport = await getTransport();
    // send mail with defined transport object
    const link = `http://${req.headers.host}/api/auth/confirmation/${token.token}`;
    console.log(link);

    let info = await transport.sendMail({
      from: process.env.HOST_MAIL, // sender address
      to: email, // list of receivers
      subject: "Email confirmation", // Subject line
      text: `Hello \n\nPlease verify your account by clicking the link: \n${link} \nThank You!\n`,
    });

    console.log("Message sent: %s", info);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return res.json({
      message: "Sended",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  
});

router.route("/delete/:id").delete(async (req, res) => {
  try {
    const id = req.params.id;
    await Promise.all([
      User.deleteOne({ _id: id }),
      Token.deleteOne({ _userId: id }),
    ]);

    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
