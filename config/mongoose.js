const mongoose = require('mongoose');
const models = require('../app/models');
const MongooseMiddleware = require('../app/shared/MongooseMiddleware');


function connect(isTesting=false) {
  const db = mongoose.connect('mongodb://hamzanaveed:114SW6nfc@ds125680.mlab.com:25680/pushcreatives');
  if (process.env.DEBUG === '*' || process.env.DEBUG === 'mongoose')
		mongoose.set('debug', true);

	require('../app/models');

	//init our custom Middlewares
	MongooseMiddleware.init(mongoose);

	return db;
}




module.exports = {
  connect
};
