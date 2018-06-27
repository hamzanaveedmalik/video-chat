/*
----------------------
Controller for everything related to coaches
----------------------
*/

//IMPORTS
const mongoose = require('mongoose'),
  authenticationController = require('./AuthenticationController');

//forward login-requests to the authentication controller
const handleLogin = (req,res,next) => authenticationController.handleLogin(req,res,next,'Coach');

//EXPORTS
module.exports = {handleLogin};
