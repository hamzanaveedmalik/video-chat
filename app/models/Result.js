//IMPORTS
const mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   validators = require('../shared/Validators');

//DEFINITION OF THE RESULT MODEL
const Result = new Schema({
  user: {
  		type: String,
      required: true,
  		virtual: {
  			api: {
  				read: [validators.read]
  			}
  		}
  },
  mainCategory: {
		type: String,
    required: true,
		virtual: {
			api: {
				read: [validators.read]
			}
		}
	},
  subCategory: {
    type: String,
    required: true,
    virtual: {
      api: {
        read: [validators.read]
      }
    }
  },
  tool: {
    type: String,
    required: true,
    virtual: {
      api: {
        read: [validators.read]
      }
    }
  },
  key: {
    type: String,
    required: true,
    virtual: {
      api: {
        read: [validators.read]
      }
    }
  },
  value: {
    type: String,
    required: true,
    virtual: {
      api: {
        read: [validators.read]
      }
    }
  }
});

//EXPORTS
module.exports = {
  scheme: Result,
  model:mongoose.model('Result', Result)
};
