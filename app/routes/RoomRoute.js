/*
----------------------
Room-Management-Routes
----------------------
*/

//IMPORTS
const express = require('express'),
  StandardController = require('../controllers/StandardController'),
  router = express.Router(),
  Security = require('../shared/Security'),
  Sanitization = require('../shared/MongooseSanitization'),
  Room = require('../models/RoomModel');

//ROUTES
//get all rooms
router.get('/',  Security.requiresSuperAdmin, StandardController.handleModel('Room').get);

//create a new room
router.post('/',  Security.requiresSuperAdmin, StandardController.handleModel('Room').create);

//delete a room
router.delete('/',  Security.requiresSuperAdmin, StandardController.handleModel('Room').delete);


//get a room by id

router.get('/:id', (req, res, next)=>{

var id = req.params.id;
var oneRoom = [];




Room.findById(id)
.then(doc=>res.status(201).json(doc))
.catch(e=>console.log(e));




});


//EXPORTS
module.exports = router;
