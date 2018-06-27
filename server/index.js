'use strict';

require('dotenv').load();

const http = require('http');
const path = require('path');

const express = require('express');
const webpack = require('webpack');
var faker = require("faker");


const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");


const mongoose = require('../config/mongoose');
const  routes = require('../app/routes/');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rest = require('../app/shared/Rest');
const webpackConfig = require("../webpack.config.js");
const tokenGenerator = require('../app/controllers/AccessTokenGenerator.js');
const UserSchema = require('../app/models/UserModel.js');

// Create Express webapp.
var app = express();
const webpackCompiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(webpackCompiler, {
  hot: true
}));

app.use(webpackHotMiddleware(webpackCompiler));

//CORS-Header
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token  '
    );
    next();
  });


//configure Logs
const logger = require('../config/logger')(app.get('env'));


// expecting json-input
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookie-parser
app.use(cookieParser());

//prevent CSS
 app.use(helmet());

//log all incoming requests
app.use((req, res, next) => {
  console.log("<----------------------------------------");
  console.log(req.method + " on " + req.originalUrl);
  console.log("---------------------------------------->");

  next();
});

//overwrite sendResponse-Handler => for sanitization & further operations
  app.use((req, res, next) => {
    res.sendResponse = rest.sendResponse.bind(this, res);
    next();
  });


  //handle uncaughtException
  process.on('uncaughtException', function(error) {

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(error.stack);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  });


//connecting to mongodb-database
  mongoose.connect();
  console.log('Successfully connected to remote DB');

  //set up routing
app.use('/', routes);

 //Test logging
console.error('ERROR');
console.warn('WARN');
console.info('INFO');
console.verbose('VERBOSE');
console.debug('DEBUG');
console.silly('SILLY');




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// basic error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendResponse(err);
  next();
});


// Create http server and run it.
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log(`Express server running on *: ${port}`);
});
