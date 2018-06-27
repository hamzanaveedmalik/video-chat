//This file handles the authentication of users


const bcrypt = require('bcrypt'),
 jwt = require('jsonwebtoken'),
 config = require('../../config/index');

const SALT = 'AXCGG_DS(9FVV3$BS4%ADSADSAfdsrF';

//user needs to be logged in
function requiresLogin(req, res, next) {
  //check if user id in query fits the user id
  next();
}

//user should be coach
function requiresCoach(req, res, next) {
  next();
}

//the coach should have been granted access by the user
function requiresGrantedAccessRights(req, res, next) {
  //check, if user has granted access for this coach
  //fetch permission table {user:, coach:, validTil:}
  console.log(req.params.uid);
  next();
}

//user needs to be superadmin
function requiresSuperAdmin(req, res, next) {
  next();
}

function hashWithSalt(value, callback) {
	if (callback)
		bcrypt.hash(value + SALT, 10, function(err, hash) {
			callback(err, hash);
		});
	else
		return bcrypt.hashSync(value + SALT, 10);
}

function compare(value, hash, callback) {
	if (callback)
		bcrypt.compare(value + SALT, hash, function(err, res) {
			callback(err, res);
		});
	else return bcrypt.compareSync(value + SALT, hash);
}

function createToken(payload) {
	return jwt.sign(payload, config.secret);
}


module.exports = {
  requiresLogin,
  requiresCoach,
  requiresSuperAdmin,
  requiresGrantedAccessRights,
  hashWithSalt,
  compare,
  createToken
}
