//IMPORTS
const
   UserController = require('../controllers/UserController'),
   mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   validators = require('../shared/Validators'),
   Security = require('../shared/Security'),
   AuthenticationController = require('../controllers/AuthenticationController');


//DEFINITION OF THE USER MODEL
const UserSchema = new Schema({
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
UserSchema.pre('save', handleForwarding);
UserSchema.pre('update', handleForwarding);
UserSchema.pre('findOneAndUpdate', handleForwarding);


function handleForwarding(next)  {
  let object = this;
  AuthenticationController.hashPassword(object, next);
}

//EXPORTS
module.exports = {
  scheme: UserSchema,
  model:mongoose.model('User', UserSchema)
};
