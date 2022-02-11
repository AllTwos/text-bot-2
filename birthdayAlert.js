require("dotenv").config();
const Birthday = require("./models/bdayData");

//My data
const bdayta = require("./bdayta");
const birthdays = bdayta.birthdays;

//Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

//Grabbing bday data token
async function grabDate() {
  try {
    return await Birthday.find();
  } catch (err) {
    console.log(err);
  }
}

//Find Birthday
async function findBirthday(date) {
  const result = await grabDate();
  const bdayToken = result[0].date;

  if (bdayToken !== date.monthDay && date.time >= 13 && date.time < 16) {
    console.log("PASSED BDAY CHECK");
    for (let birthday of birthdays) {
      const bdayMessage = `Happy ${birthday.type} ${
        birthday.name
      }! Is what Taylor will say when you remind him that it's your ${birthday.type.toLowerCase()}. He has heroically automated this process to put the onus on you to ensure that you get the proper well wishes from him.  This has been a message from Taylor's bot. Don't reply to this number, it goes nowhere. `;

      if (birthday.date === date.monthDay) {
        //Send Text
        client.messages
          .create({
            body: bdayMessage,
            to: "+" + birthday.phone,
            from: "+" + process.env.TWILIO_PHONE,
          })
          //alerts me
          .then((message) => {
            console.log(message);
            client.messages.create({
              body: message.body,
              to: "+" + process.env.MY_PHONE,
              from: "+15304664153",
            });
          })
          .catch((err) => console.log(err));
      }
    }
    //update date token
    await Birthday.findOneAndUpdate(
      { date: bdayToken },
      { date: date.monthDay }
    );
  }

  console.log(
    `fired Bday func ${date.monthDay} ${date.time} ${date.min} ${date.seconds} token:${bdayToken} `
  );
}

module.exports = findBirthday;
