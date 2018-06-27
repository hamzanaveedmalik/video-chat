//IMPORTS
const Errors = require('../errors');


//checks if all required fields are there
const requiredFields = (keyArray) => {
  return (req, res, next) => {
    for (let key of keyArray) {
      if (!req.body[key]) {
        throw new Errors.MissingInputError("Required field " + key + " is missing. ");
        next();
      }
    }
    next();
  }
};

//EXPORTS
module.exports = {
  requiredFields
};
