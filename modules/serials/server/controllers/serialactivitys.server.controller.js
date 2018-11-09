'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  // Serialactivity = mongoose.model('Serialactivity'),
  _ = require('lodash');

/**
 * Create a serialactivity
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var serialactivity = new req.db.Serialactivity(req.body);

  serialactivity.user = req.user;

  // console.log(serialactivity);

  serialactivity.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serialactivity);
    }
  });
};

/**
 * Show the current serialactivity
 */
exports.read = function(req, res) {
  res.json(req.serialactivity);
};

/**
 * Update a serialactivity
 */
/* exports.update = function(req, res) {

  var serialactivity = req.serialactivity;

  serialactivity = _.extend(serialactivity, req.body);

  serialactivity.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serialactivity);
    }
  });
}; */

/**
 * Delete an serialactivity
 */
/* exports.delete = function(req, res) {
  var serialactivity = req.serialactivity;

  serialactivity.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serialactivity);
    }
  });
}; */

/**
 * List of serialactivity
 */
exports.list = function(req, res) {
  req.db.Serialactivity.find().sort('-created').populate('user').exec(function(err, serialactivitys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serialactivitys);
    }
  });
};

/**
 * serialactivity middleware
 */
exports.serialactivityByID = function(req, res, next, id) {
  req.db.Serialactivity.findById(id).exec(function(err, serialactivity) {
    if (err) return next(err);
    if (!serialactivity) return next(new Error('Failed to load serialactivity ' + id));
    req.serialactivity = serialactivity;
    next();
  });
};
