/*
----------------------
Controller for everything related to users
----------------------
*/

//IMPORTS
const mongoose = require('mongoose'),
  authenticationController = require('./AuthenticationController');

//forward login-requests to the authentication controller
const handleLogin = (req,res,next) => authenticationController.handleLogin(req,res,next,'User');

//EXPORTS
module.exports = {handleLogin};
