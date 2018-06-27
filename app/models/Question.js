//IMPORTS
const mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   Policies = require('./QuestionnairePolicies'),
   validators = {};

//DEFINITION OF THE QUESTIONS MODEL
const Question = new Schema({
  title: {
		type: String,
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	},
  type: {
		type: ["Selection", "Freitext"],
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
  options: {
		type: [String],
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	}
});

//EXPORTS
module.exports = {
  scheme: Question,
  model:mongoose.model('Question', Question)
};
