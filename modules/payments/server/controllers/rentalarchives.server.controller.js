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
 * Create a Rental Archive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var rentalarchive = new req.db.Rentalarchive(req.body);

  rentalarchive.user = req.user;

  // console.log(rentalarchive);

  rentalarchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rentalarchive);
    }
  });
};

/**
 * Show the current rentalarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var rentalarchive = req.rentalarchive ? req.rentalarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rentalarchive.isCurrentUserOwner = req.user && rentalarchive.user && rentalarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(req.rentalarchive);
};

/**
 * Update a rentalarchive
 */
/* exports.update = function(req, res) {

  var rentalarchive = req.rentalarchive;

  rentalarchive = _.extend(rentalarchive, req.body);

  rentalarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rentalarchive);
    }
  });
}; */

/**
 * Delete an rentalarchive
 */
/* exports.delete = function(req, res) {
  var rentalarchive = req.rentalarchive;

  rentalarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rentalarchive);
    }
  });
}; */

/**
 * List of rentalarchive
 */
exports.list = function(req, res) {
  req.db.Rentalarchive.find().sort('-created').populate('rental').populate('customer').exec(function(err, rentalarchives) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(documents);
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(rentalarchives, opts1, function (err, rentalarchives) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(rentalarchives);
        }
      });
    }
  });
};

/**
 * rentalarchive middleware
 */
exports.rentalarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'rental archive is invalid'
    });
  }

  req.db.Rentalarchive.findById(id).exec(function (err, rentalarchive) {
    if (err) {
      return next(err);
    } else if (!rentalarchive) {
      return res.status(404).send({
        message: 'rental archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(rentalarchive, opts, function (err, rentalarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.rentalarchive = rentalarchive;
          next();
        }
      });
    }
  });
};
