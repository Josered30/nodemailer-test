const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());

const routes = require("./routes/auth");
app.use("/api/auth", routes);

module.exports = app;
