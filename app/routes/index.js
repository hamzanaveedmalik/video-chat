/*
----------------------
This file sets up all the basic routes
----------------------
*/

//IMPORTS
const express = require('express'),
  AuthRoutes = require('./Authentication'),
  UserRoutes = require('./UserRoutes'),
  QuestionnaireRoutes = require('./Questionnaires'),
  CoachRoutes = require('./CoachRoutes'),
  RoomRoute = require('./RoomRoute'),
  TokenRoute = require('./TokenRoute');

const router = express.Router();
const v1 = express.Router();

v1.use('/users', UserRoutes);
v1.use('/questionnaires', QuestionnaireRoutes);
v1.use('/auth', AuthRoutes);
v1.use('/coaches', CoachRoutes);
v1.use('/room', RoomRoute);
v1.use('/token', TokenRoute);

router.use('/v1', v1);
router.use('/', v1);

module.exports = router;
