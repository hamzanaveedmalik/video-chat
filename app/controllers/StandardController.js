//IMPORTS
const mongoose = require('mongoose');

handleModel = function(model, options = {}) {
    let Model = mongoose.model(model);
    return {
      create: function(req, res, next) {
        Helpers.handleBodyInput(req, (input) => {
          let object = new Model(input);
          object.save(res.sendResponse);
        });
      },
      delete: function(req, res, next) {
        Helpers.handleInput(req, options, (input) => {
          Model.remove(input, res.sendResponse);
        });
      },
      update: function(req, res, next) {
        let filter = req.params;
        input = Object.assign(req.body, req.params);
        Model.findOneAndUpdate(filter, input, {upsert: options.upsert || false, new: true}, res.sendResponse);
      },
      get: function(req, res, next) {
        Helpers.handleInput(req, {...options, get: true}, (input) => {
          console.log(input);
          Model.find(input).customExec(req, res.sendResponse);
        });
      }
    }
}

const Helpers = {
  handleBodyInput: function(req, callback) {
    if (req.body instanceof Array) {
      for (input in req.body) {
        callback(input);
      }
    } else {
      callback(req.body);
    }
  },
  handleInput: function(req, options, callback) {
    if (options.me) {
      if (req.body) {
        data = {...req.body, "_id": req.session.uid};
      }
      callback(data);
    }
    else if (req.params.id || req.params._id) {
      //one single object
      req.params._id = req.params._id || req.params.id;
      delete req.params.id;
      let data = req.params;
      if (req.body) {
        data = {...req.body, ...data};
      }
      callback(data);
    } else if (options.get) {
      callback(req.params);
    } else {
      //multiple objects
      this.handleBodyInput(req, (input) => {
        if (input.id || input._id) {
          input._id = input._id || input.id;
          delete input.id;
          callback(input);
        } else {
          callback({});
        }
      });
    }
  }
};

module.exports = {handleModel};
