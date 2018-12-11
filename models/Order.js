const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
  datetime: Date,
  items: Array,
  uid: String
});

module.exports = mongoose.model("orders", OrdersSchema);
