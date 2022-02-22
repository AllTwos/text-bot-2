const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cryptoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fetch: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    preVal: {
      type: Number,
      required: false,
    },
    addVal: {
      type: Number,
      required: true,
    },
    minVal: {
      type: Number,
      required: true,
    },
    dateToken: {
      type: String,
      required: true,
    },
    prevDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
