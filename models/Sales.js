const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesSchema = new Schema({
  or_no: Number,
  datetime: Date,
  items: Array,
  uid: String,
  payment_amount: Number,
  change: Number
});

module.exports = mongoose.model("sales", SalesSchema);
