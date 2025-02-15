const Joi = require("joi");
const mongoose = require("mongoose");

// Custom validation function for MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId format");
  }
  return value;
};

module.exports = {
  objectId,
};
