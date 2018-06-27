/*
----------------------
Coaches-Management-Routes
----------------------
*/

//IMPORTS
const express = require('express'),
  StandardController = require('../controllers/StandardController'),
  router = express.Router(),
  Security = require('../shared/Security'),
  Sanitization = require('../shared/MongooseSanitization');

//ROUTES
//get all users
router.get('/',  Security.requiresSuperAdmin, StandardController.handleModel('Coach').get);

//create a new user
router.post('/',  Security.requiresSuperAdmin, StandardController.handleModel('Coach').create);

//delete a user
router.delete('/',  Security.requiresSuperAdmin, StandardController.handleModel('Coach').delete);


//EXPORTS
module.exports = router;
