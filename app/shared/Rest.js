const mongoose = require('mongoose'),
  Sanitization = require('./MongooseSanitization');
module.exports.sendResponse = (res, err = null, payload = [], message = '') => {
	if (!err && payload && res.locals.dataModel) {
		try {
			payload = Sanitization.sanitizeApiOutput(res.locals.dataModel, payload);
		}
		catch (e) {
      console.error("Error in Sanitization: " + e);
			err = e;
		}
	}
	else {
    //TODO: reenable for production environment
		//console.warn('Model sanitization not configured!');
	}

	if (!err) {
		res.json({
			success: true,
			message: message,
			payload: payload,
			errors: []
		});
	}
	else {
		//err = wrapError(err);
		const ret = {
			success: false,
			payload: {},
			error: {
				name: err.name
			}
		};
		if (err.status) {
			ret.error.message = err.message;
		}
		res.status(err.status || 500).json(ret);
	}
};

function wrapError(err) {
	if (err.name === 'ValidationError')
		return new errors.WrongDataError(err);
	return err;
}
