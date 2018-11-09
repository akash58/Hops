'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  // Specdesc = mongoose.model('Specdesc'),
  _ = require('lodash');

/**
 * Create a specdesc
 */
exports.create = function(req, res) {

  var specdesc = new req.db.Specdesc({
    specificationDescription: req.body.specificationDescription,
    component: req.body.component._id
  });

  specdesc.user = req.user;

  specdesc.save(function(err) {
    if (err) {
      // console.log('Error found is : ');

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(specdesc);
    }
  });

};

/**
 * Show the current specdesc
 */
exports.read = function(req, res) {
  res.json(req.specdesc);
};

/**
 * Update a specdesc
 */
exports.update = function(req, res) {

  var specdesc = req.specdesc;

  specdesc = _.extend(specdesc, req.body);

  specdesc.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(specdesc);
    }
  });
};

/**
 * Delete an specdesc
 */
/* exports.delete = function(req, res) {
  var specdesc = req.specdesc;

  specdesc.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(specdesc);
    }
  });
}; */

/**
 * List of specdesc
 */
exports.list = function(req, res) {
  req.db.Specdesc.find().sort('specificationDescription').populate('user').populate('component').exec(function(err, specdescs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(specdescs);
    }
  });
};

/**
 * Specdesc middleware
 */
exports.specdescByID = function(req, res, next, id) {
  req.db.Specdesc.findById(id).exec(function(err, specdesc) {
    if (err) return next(err);
    if (!specdesc) return next(new Error('Failed to load specdesc ' + id));
    req.specdesc = specdesc;
    next();
  });
};
