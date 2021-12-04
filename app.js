const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//Connect to mongodb
mongoose
  .connect(process.env.DB_CONNECT_STR)
  .then((result) => {
    //Listening
    app.listen(process.env.PORT || 4000, () => {
      console.log(`listening on port`);
    });

    console.log("connected to db");
  })
  .catch((err) => console.log(err));

//My data
const timeReq = require("./times");
const findBirthday = require("./birthdayAlert");
const { twilioCrypto, cryptoData } = require("./crypto");

const app = express();

app.get("/", (req, res) => {
  res.send("The Son of TOJO bot is twiddling in the background");
});

//Birthday Fetch , 30 min.
setInterval(() => {
  findBirthday(timeReq.getTime(new Date()));
}, 1800000);

//Crypto Fetch , 30ish min.
setInterval(async () => {
  twilioCrypto(timeReq.getTime(new Date()));
}, 1830000);
