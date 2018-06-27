/*
----------------------
User-Management-Routes
----------------------
*/

//IMPORTS
const express = require('express'),
  StandardController = require('../controllers/StandardController'),
  router = express.Router(),
  idpRouter = require('./User/IDPProfile'),
  Security = require('../shared/Security'),
  Sanitization = require('../shared/MongooseSanitization'),
  User = require('../models/UserModel');

//ROUTES
//get all users
router.get('/',  Security.requiresSuperAdmin, StandardController.handleModel('User').get);

//create a new user
router.post('/',  Security.requiresSuperAdmin, StandardController.handleModel('User').create);

//delete a user
router.delete('/',  Security.requiresSuperAdmin, StandardController.handleModel('User').delete);

//SUBROUTERS
router.use('/:user/idp', Security.requiresLogin, idpRouter);

//TESTING



//EXPORTS
module.exports = router;
