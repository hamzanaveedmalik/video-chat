/*
----------------------
everything related to logging in, logging out and registrations
----------------------
*/

//IMPORTS
const express = require('express'),
  CoachController = require('../controllers/CoachesController'),
  UserController = require('../controllers/UserController'),
  Middleware = require('../shared/Middleware'),
  router = express.Router();

//Coach login
router.post('/session/coach', Middleware.requiredFields(["email", "password"]), CoachController.handleLogin);

//User login
router.post('/session', Middleware.requiredFields(["email", "password"]), UserController.handleLogin);

//EXPORTS
module.exports = router;
