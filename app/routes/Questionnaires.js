/*
----------------------
Questionnaire-Routes
----------------------
*/

//IMPORTS
const express = require('express'),
  StandardController = require('../controllers/StandardController'),
  router = express.Router(),
  Security = require('../shared/Security');

//ROUTES
//get all questionnaires
router.get('/',  Security.requiresLogin, StandardController.handleModel('Questionnaire').get);
//get a specific questionnaire
router.get('/:id',  Security.requiresLogin, StandardController.handleModel('Questionnaire').get);

//EXPORTS
module.exports = router;
