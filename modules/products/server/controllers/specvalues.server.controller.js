'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Specvalue = mongoose.model('Specvalue'),
  _ = require('lodash');

/**
 * Create a specvalue
 */
exports.create = function(req, res) {

  var specvalue = new req.db.Specvalue(req.body);

  specvalue.user = req.user;

  specvalue.save(function(err) {
    if (err) {
      // console.log('Error found is : ');

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(specvalue);
    }
  });

};

/**
 * Show the current specvalue
 */
exports.read = function(req, res) {
  res.json(req.specvalue);
};

/**
 * Update a specvalue
 */
exports.update = function(req, res) {
  // console.log(req.body);

  // console.log(req.specvalue);

  var specvalue = req.specvalue;

  specvalue = _.extend(specvalue, req.body);

  specvalue.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(specvalue);
    }
  });
};

/**
 * Delete an specvalue
 */
exports.delete = function(req, res) {
  var specvalue = req.specvalue;

  specvalue.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(specvalue);
    }
  });
};

/**
 * List of specvalue
 */
exports.list = function(req, res) {
  req.db.Specvalue.find().sort('-specdesc.created').populate('specdesc').populate('products').exec(function(err, specvalue) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(specvalue, opts1, function (err, specvalue) {
        if (err) {
          // console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(specvalue);
          // console.log(specvalue);
        }
      });
    }
  });
};

/**
 * Specvalue middleware
 */
exports.specvalueByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'specvalue is invalid'
    });
  }

  req.db.Specvalue.findById(id).exec(function (err, specvalue) {
    if (err) {
      return next(err);
    } else if (!specvalue) {
      return res.status(404).send({
        message: 'No specvalue with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(specvalue, opts, function (err, specvalue) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.specvalue = specvalue;
          next();
        }
      });
    }
  });
};
