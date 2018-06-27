const express = require('express');
const router = express.Router();
var faker = require("faker");
const tokenGenerator = require('../controllers/AccessTokenGenerator.js');


router.get('/', (req,res,next)=>{

console.log('User Identity is ', identity);

 var identity = faker.name.findName();

  var token = tokenGenerator(identity);
  res.send({
    identity,
    token
  });
});


module.exports = router;
