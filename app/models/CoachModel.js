//IMPORTS
const
   CoachController = require('../controllers/CoachesController'),
   mongoose = require('mongoose'),
   AuthenticationController = require('../controllers/AuthenticationController'),
   Schema = mongoose.Schema,
   validators = require('../shared/Validators');

//DEFINITION OF THE USER MODEL
const CoachSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		virtual: {
			api: {
				write: [validators.nonEmpty, validators.create, validators.update],
				read: [validators.read]
			}
		}
	},
  lastName: {
    type: String,
    required: true,
    virtual: {
      api: {
        write: [validators.nonEmpty, validators.create, validators.update],
        read: [validators.read]
      }
    }
  },
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		validate: function(email) {
		    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		    return re.test(email)
		},
		virtual: {
			api: {
				write: [validators.create],
				read: [validators.read]
			}
		}
	},
	password: {
		type: String,
		virtual: {
			api: {
				write: []
			}
		}
	},
	meta: {
		registration_token: {
			type: String
		},
		registrationMailSent: {
			type: Boolean,
			default: false
		},
		activated: {
			type: Boolean,
			default: false
		}
	}
});


//hash the user's password
CoachSchema.pre('save', handleForwarding);
CoachSchema.pre('update', handleForwarding);
CoachSchema.pre('findOneAndUpdate',handleForwarding);


function handleForwarding(next)  {
  let object = this;
  AuthenticationController.hashPassword(object, next);
}

//EXPORTS
module.exports = {
  scheme: CoachSchema,
  model:mongoose.model('Coach', CoachSchema)
};
