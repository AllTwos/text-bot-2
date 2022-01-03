const axios = require("axios");
const cheerio = require("cheerio");
const Crypto = require("./models/cryptoData");

//Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

//Grabbing Data
const cryptoData = async () => {
  try {
    return await Crypto.find();
  } catch (error) {
    console.log(error);
  }
};

//Check for Values
async function getCoinMarketCapPrice(subDir) {
  try {
    const siteUrl = `https://coinmarketcap.com/currencies/${subDir}/`;

    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    //cheerio
    const $ = cheerio.load(data);
    const elmSelector =
      "#__next > div.bywovg-1.fUzJes > div > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.eMxKgr.container > div.n78udj-0.jskEGI > div > div.sc-16r8icm-0.kjciSH.priceSection > div.sc-16r8icm-0.kjciSH.priceTitle > div";
    const price = parseFloat(
      $(elmSelector).children().text().replace(/[$,]/g, "")
    );

    return price;
  } catch (err) {
    console.error(err);
  }
}

async function getMarketWatchPriceFeed(subDir) {
  try {
    const siteUrl = `https://www.marketwatch.com/investing/stock/${subDir}`;

    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    //cheerio
    const $ = cheerio.load(data);
    const elmSelector =
      "#maincontent > div.region.region--intraday > div.column.column--aside > div > div.intraday__data > h2 > bg-quote";
    const price = parseFloat($(elmSelector).text().replace(/[,]/g, ""));

    return price;
  } catch (err) {
    console.error(err);
  }
}

//Compare values and text
async function twilioCrypto(date) {
  const phoneNumbers = [process.env.MY_PHONE, process.env.PHIL_PHONE];

  const cryptoDataGet = await cryptoData();

  await cryptoDataGet.map(async (crypto) => {
    let { id, name, value, addVal, dateToken, fetch, prevDate } = crypto;

    //checking current value
    let checkValue = undefined;
    switch (fetch) {
      case "cmk":
        checkValue = await getCoinMarketCapPrice(`${name}`);
        break;
      case "mw":
        checkValue = await getMarketWatchPriceFeed(`${name}`);
        break;
    }

    if (date.time > 13 && date.time < 24 && checkValue > value + addVal) {
      console.log(`Texting ${name} and updating db`);

      await Crypto.findOneAndUpdate(
        { name: name },
        {
          prevDate: dateToken,
          dateToken: date.monthDay,
          value: checkValue,
        }
      );

      //Send Text
      for (number of phoneNumbers) {
        const valFetch = await Crypto.find({ name: name });
        const newVal = await valFetch[0].value;
        const newDateToken = await valFetch[0].dateToken;
        const newPrevDate = await valFetch[0].prevDate;
        await client.messages
          .create({
            body: `${name} went up! - value: ${newVal}, date: ${newDateToken}, last update ${newPrevDate}`,
            to: "+" + number,
            from: "+" + process.env.TWILIO_PHONE,
          })
          .then((message) => {
            console.log(message);
          });
      }
    }
  });

  console.log(`Fired Crypto func date:${date.monthDay} , ${date.seconds}`);
}

module.exports = { twilioCrypto, cryptoData };
