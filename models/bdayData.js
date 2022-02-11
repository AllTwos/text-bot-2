const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const birthdaySchema = new Schema({
  date: {
    type: String,
    require: true,
  },
});

const Birthday = mongoose.model("Birthday", birthdaySchema);

module.exports = Birthday;
