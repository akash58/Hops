'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  _ = require('lodash');

/**
 * Create a Foodorderarchive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var foodorderarchive = new req.db.Foodorderarchive(req.body);

  foodorderarchive.user = req.user;

  // console.log(foodorderarchive);

  foodorderarchive.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(foodorderarchive);
    }
  });
};

/**
 * Show the current Foodorderarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var foodorderarchive = req.foodorderarchive ? req.foodorderarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  foodorderarchive.isCurrentUserOwner = req.user && foodorderarchive.user && foodorderarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(req.foodorderarchive);
};

/**
 * Update a Foodorderarchive
 */
/* exports.update = function(req, res) {

  var foodorderarchive = req.foodorderarchive;

  foodorderarchive = _.extend(foodorderarchive, req.body);

  foodorderarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(foodorderarchive);
    }
  });
}; */

/**
 * Delete an foodorderarchive
 */
/* exports.delete = function(req, res) {
  var foodorderarchive = req.foodorderarchive;

  foodorderarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(foodorderarchive);
    }
  });
}; */

/**
 * List of foodorderarchive
 */
exports.list = function(req, res) {
  req.db.Foodorderarchive.find().sort('-created').exec(function(err, foodorderarchives) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(foodorderarchives);
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(foodorderarchives, opts1, function (err, foodorderarchives) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(foodorderarchives);
        }
      });
    }
  });
};

/**
 * foodorderarchive middleware
 */
exports.foodorderarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'food order archive is invalid'
    });
  }

  req.db.Foodorderarchive.findById(id).exec(function (err, foodorderarchive) {
    if (err) {
      return next(err);
    } else if (!foodorderarchive) {
      return res.status(404).send({
        message: 'No food order archive with that identifier has been found'
      });
    } else {
      // console.log(foodorderarchive);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(foodorderarchive, opts, function (err, foodorderarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.foodorderarchive = foodorderarchive;
          next();
        }
      });
    }
  });
};
