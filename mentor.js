const fetch = require("node-fetch");
const Mentor = require("./models/mentorData");

//Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function mentorFind() {
  try {
    return Mentor.findOne({ name: "mentorToken" });
  } catch (err) {
    console.log(err);
  }
}

async function fetchFlairText(text) {
  try {
    const getMentorData = await mentorFind();
    let redditCreatedToken = getMentorData.value;

    const res = await fetch("https://www.reddit.com/r/programmingbuddies.json");
    const response = await res.json();
    const data = response.data.children;

    for (d of data) {
      const val = d.data;
      // console.log(val);
      if (!val.link_flair_text) {
        void 0;
      } else if (
        val.link_flair_text.includes(text) &&
        val.created_utc > redditCreatedToken
      ) {
        //Send Text
        client.messages
          .create({
            body: `title: ${val.title} || created: ${
              val.created_utc
            } || self text: ${val.selftext.substr(0, 1000)}`,
            to: "+" + process.env.MY_PHONE,
            from: "+" + process.env.TWILIO_PHONE,
          })
          .then((message) => {
            console.log(message);
          })
          .catch((err) => {
            console.log(err);
          });

        //Find and Update with mongo
        await Mentor.findOneAndUpdate(
          { name: "mentorToken" },
          { value: val.created_utc }
        );
      }
    }
  } catch (err) {
    return console.log(
      err +
        " ,failure to launch starring Matthew McConaughey and Sarah Jemmikus Parker"
    );
  }
}

module.exports = fetchFlairText;
