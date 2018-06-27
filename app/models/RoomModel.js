//IMPORTS
const mongoose = require('mongoose'),
   validators = require('../shared/Validators');

//DEFINITION OF A ROOM MODEL
const RoomSchema = mongoose.Schema({

  unique_name:{
    type: String,
		required: true,
    unique:true,
		virtual: {
			api: {
				read: [validators.read]
			}
		}
  },

  created_by :{
    type: String,
    required: true,
    virtual: {
      api: {
        write: [validators.create],
        read: [validators.read]
      }
    }

  },

  date_created : {
    type: Date,
    required: true,
    default: Date.now,
    virtual: {
			api: {
				write: [validators.create],
				read: [validators.read]
			}
		}

  },

  end_time : {
    type:Date,
    default: Date.now,
    virtual: {
			api: {
				write: [validators.create],
				read: [validators.read]
			}
		}

  } ,

  duration: {
   type: Date,
   virtual: {
     api: {
       write: [validators.create],
       read: [validators.read]
     }
   }
 },

  sid : {
    type: String,
    unique:true,
    virtual: {
			api: {
				write: [validators.create],
				read: [validators.read]
			}
		}

  }

});

module.exports = mongoose.model('Room', RoomSchema);
