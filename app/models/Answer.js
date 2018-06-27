//IMPORTS
const mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   Questionnaire = require('./Questionnaire'),
   validators = {};

//DEFINITION OF THE QUESTIONS MODEL
const Answer = new Schema({
  questionnaire: {
    type: Schema.ObjectId,
    virtual: {
      api: {
        write: read: [validators.create],
        read: [validators.read]
      }
    }
  }
});

//EXPORTS
module.exports = {
  scheme: Answer,
  model:mongoose.model('Answer', Answer)
};
