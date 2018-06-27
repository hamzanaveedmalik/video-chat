//IMPORTS
const mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   QuestionModel = require('./Question'),
   Policies = require('./QuestionnairePolicies'),
   validators = {};

//DEFINITION OF THE QUESTIONNAIRE MODEL
const Questionnaire = new Schema({
  title: {
		type: String,
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	},
  mainCategory: {
		type: ["Werte", "Persönlichkeit"],
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	},
  subCategory: {
    type: ["Werte", "Persönlichkeit"],
    virtual: {
      api: {
        read: [validators.read]
      }
    }
  },
  policies: {
		type: [Policies],
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	},
  questions: {
		type: [QuestionModel.Scheme],
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	}
});

//EXPORTS
module.exports = {
  scheme: Questionnaire,
  model:mongoose.model('Questionnaire', Questionnaire)
};
