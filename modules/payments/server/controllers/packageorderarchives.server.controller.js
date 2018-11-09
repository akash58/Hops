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
 * Create a Package Order Archive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var packageorderarchive = new req.db.Packageorderarchive(req.body);

  packageorderarchive.user = req.user;

  // console.log(packageorderarchive);

  packageorderarchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(packageorderarchive);
    }
  });
};

/**
 * Show the current packageorderarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var packageorderarchive = req.packageorderarchive ? req.packageorderarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  packageorderarchive.isCurrentUserOwner = req.user && packageorderarchive.user && packageorderarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(req.packageorderarchive);
};

/**
 * Update a packageorderarchive
 */
/* exports.update = function(req, res) {

  var packageorderarchive = req.packageorderarchive;

  packageorderarchive = _.extend(packageorderarchive, req.body);

  packageorderarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(packageorderarchive);
    }
  });
};
 */
/**
 * Delete an packageorderarchive
 */
/* exports.delete = function(req, res) {
  var packageorderarchive = req.packageorderarchive;

  packageorderarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(packageorderarchive);
    }
  });
}; */

/**
 * List of packageorderarchive
 */
exports.list = function(req, res) {
  req.db.Packageorderarchive.find().sort('-created').exec(function(err, packageorderarchives) {
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
      User.populate(packageorderarchives, opts1, function (err, packageorderarchives) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(packageorderarchives);
        }
      });
    }
  });
};

/**
 * packageorderarchive middleware
 */
exports.packageorderarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'package order archive is invalid'
    });
  }

  req.db.Packageorderarchive.findById(id).exec(function (err, packageorderarchive) {
    if (err) {
      return next(err);
    } else if (!packageorderarchive) {
      return res.status(404).send({
        message: 'No package order archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(packageorderarchive, opts, function (err, packageorderarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.packageorderarchive = packageorderarchive;
          next();
        }
      });
    }
  });
};
