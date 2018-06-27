/*
----------------------
Controller for everything related to room
----------------------
*/

//IMPORTS
const mongoose = require('mongoose'),
  authenticationController = require('./AuthenticationController');

//forward login-requests to the authentication controller
const handleLogin = (req,res,next) => authenticationController.handleLogin(req,res,next,'Room');

//EXPORTS
module.exports = {handleLogin};
