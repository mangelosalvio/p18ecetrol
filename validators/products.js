const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProductInput(data) {
  let errors = {};

  if (isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (isEmpty(data.price)) {
    errors.price = "Price is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
