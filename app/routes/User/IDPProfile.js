//IMPORTS
const express = require('express'),
  StandardController = require('../../controllers/StandardController'),
  router = express.Router({mergeParams: true}),
  Security = require('../../shared/Security');

//ROUTES
router.use(Security.requiresCoach, Security.requiresGrantedAccessRights);

//getting aggregated results for one mainCategory
router.get('/:mainCategory/results', StandardController.handleModel('Result').get);

//getting aggregated results for one subcategory
router.get('/:mainCategory/:subCategory/results', StandardController.handleModel('Result').get);

//getting aggregated results for one specific tool
router.get('/:mainCategory/:subCategory/:tool/results', StandardController.handleModel('Result').get);

//posting results for a specific tool; create, if it does not yet exist
router.post('/:mainCategory/:subCategory/:tool/results', StandardController.handleModel('Result', {upsert: true}).update);

//updating results for a specific tool
router.post('/:mainCategory/:subCategory/:tool/results', StandardController.handleModel('Result', {upsert: true}).update);

//getting one specific result
router.get('/:mainCategory/:subCategory/:tool/results/:key', StandardController.handleModel('Result').get);

//getting the questionnaire for a specific tools
router.get('/:mainCategory/:subCategory/:tool/questions', StandardController.handleModel('Questionnaire').get);

//getting replies for all questions
router.get('/:mainCategory/:subCategory/:tool/questions/results', StandardController.handleModel('Result').get);

//getting the tool definition and questions
router.get('/:mainCategory/:subCategory/:tool', StandardController.handleModel('Result').get);

//getting the tool's questions
router.get('/:mainCategory/:subCategory', StandardController.handleModel('Result').get);

module.exports = router;
