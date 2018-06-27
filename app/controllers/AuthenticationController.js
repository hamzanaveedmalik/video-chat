/*
----------------------
Controller for everything related to authentication
----------------------
*/

//IMPORTS
const mongoose = require('mongoose'),
  AuthenticationToken = mongoose.model('AuthenticationToken'),
  Errors = require('../errors'),
  Security = require('../shared/Security');

//login users & coaches
const handleLogin = (req,res,next, modelString) => {
  let model = mongoose.model(modelString);
  let {email, password} =  req.body;
  email = email.toLowerCase();

  model.findOne({email}, (err, user) => {
    if (err) return res.sendResponse(err);

    //no user found
    if (!user) res.sendResponse(new Errors.WrongCredentialError());

    //check if password is correct
    const valid = Security.compare(password, user.password);
    if (!valid) return res.sendResponse(new Errors.WrongCredentialError());

    //generates a session token
    let token = createAuthenticationToken(user)
    .then(token => {
      //store user information in current request
      req.session = {
        uid: user._id,
        user: user
      };
      //aggregate payload
      let payload = {
        user,
        session: token.getJsonToken()
      };
      //send response
      res.sendResponse(null, payload);
    })
    .catch(res.sendResponse);



  });
};

//generates an authentication token for the current session and creates a session in the database
function createAuthenticationToken(user) {
	const token = new AuthenticationToken({user});
	return token
		.save()
		.then(token);
}

//logout users & coaches
const handleLogout = (req, res, next, modelString) => {

};

//register Users
const handleRegistration = (req, res, next) => {

};

//revalidate existing sessions
const handleRevalidate = (req, res, next) => {

}

//reset the user's password
const resetPassword = (req, res, next) => {

}

//hash the user's password, is called from model
const hashPassword = (user, callback) => {


	if (user.isNew || (user.isModified && user.isModified('password')) || (user._update && user._update.password)) {
		const password = user.password || user._update.password;
		Security.hashWithSalt(password, function(err, hash) {
			if (err) return callback(err);

			if (user._update && user._update.password)
				user._update.password = hash;
			else
				user.password = hash;
			callback();
		});
	}
	else callback();
}


//EXPORTS
module.exports = {
  handleLogin,
  handleLogout,
  handleRegistration,
  handleRevalidate,
  hashPassword
}
