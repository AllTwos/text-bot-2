const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

//Connect to mongodb
mongoose
  .connect(process.env.DB_CONNECT_STR)
  .then((result) => {
    //Listening
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    });

    console.log("connected to db");
  })
  .catch((err) => console.log(err));

//My data
const timeReq = require("./times");
const findBirthday = require("./birthdayAlert");
const { twilioCrypto, cryptoData } = require("./crypto");
const fetchFlairText = require("./mentor");

const app = express();

app.get("/", (req, res) => {
  res.send("The Son of TOJO bot is twiddling in the background");
});

// //Birthday Fetch , 5 min.
setInterval(async () => {
  findBirthday(timeReq.getTime(new Date()));
}, 300000);

// //Crypto Fetch , 5ish min.
setInterval(async () => {
  twilioCrypto(timeReq.getTime(new Date()));
}, 380000);

//Mentor Fetch 2 min.
setInterval(async () => {
  fetchFlairText("OFFERING TO MENTOR");
}, 120000);
