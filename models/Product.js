const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  barcode: String,
  weight: Number,
  price: Number
});

module.exports = mongoose.model("products", ProductSchema);
