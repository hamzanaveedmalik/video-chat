const mongoose = require('mongoose');
const Security = require('../../shared/Security');
const Schema = mongoose.Schema;

/**
 * @module AuthenticationToken
 */

const AuthenticationTokensSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

AuthenticationTokensSchema.statics.findByToken = function(token, callback) {
	const userId = mongoose.Types.ObjectId.getObjectId(token.user);
	return this
		.findById(token._id)
		.where('user').eq(userId)
		.exec(callback);
};

AuthenticationTokensSchema.statics.invalidateAll = function(tokenObject) {
	const user = tokenObject.user;
	return this
		.find({user})
		.deleteMany()
		.exec()
		.then(tokens => tokenObject);
};

AuthenticationTokensSchema.methods.getJsonToken = function() {

	return Security.createToken({
		uid: mongoose.Types.ObjectId.getObjectId(this.user),
		tid: this._id
	});
};

module.exports = mongoose.model('AuthenticationToken', AuthenticationTokensSchema);
