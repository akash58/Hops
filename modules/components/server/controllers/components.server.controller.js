'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  // Component = mongoose.model('Component'),
  _ = require('lodash');

/**
 * Create a component
 */
exports.create = function(req, res) {
  var component = new req.db.Component(req.body);

  component.user = req.user;

  component.save(function(err) {
    if (err) {

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(component);
    }
  });
};

exports.returnActiveComponent = function(req, res, next) {
  next();
};

/**
 * Show the current component
 */
exports.read = function(req, res) {
  res.json(req.component);
};

/**
 * Update a component
 */
exports.update = function(req, res) {
  // console.log(req.body);
  var component = req.component;

  component = _.extend(component, req.body);

  component.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(component);
    }
  });
};

/**
 * Delete an component
 */
/* exports.delete = function(req, res) {
  var component = req.component;

  component.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(component);
    }
  });
}; */

/**
 * List of component
 */
exports.list = function(req, res) {
  req.db.Component.find().sort('-created').populate('user').exec(function(err, components) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(components);
    }
  });
};

/**
 * Component middleware
 */
exports.componentByID = function(req, res, next, id) {
  req.db.Component.findById(id).exec(function(err, component) {
    if (err) return next(err);
    if (!component) return next(new Error('Failed to load component ' + id));
    req.component = component;
    next();
  });
};
