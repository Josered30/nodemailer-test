const { connect } = require("mongoose");

async function startConnection() {
  try {
    await connect(process.env.MONGODB_URI || "mongodb://localhost/nodemailer");
    console.log("Database is connected");
  } catch (e) {
    console.log("Connection error:", e);
  }
}

exports.startConnection = startConnection;
