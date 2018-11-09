'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  // Billfoodorderarchive = mongoose.model('Billfoodorderarchive'),
  _ = require('lodash');

/**
 * Create a Bill Food-order Archive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billfoodorderarchive = new req.db.Billfoodorderarchive(req.body);

  billfoodorderarchive.user = req.user;

  // console.log(billfoodorderarchive);

  billfoodorderarchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billfoodorderarchive);
    }
  });
};

/**
 * Show the current BillFoodOrderarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billfoodorderarchive = req.billfoodorderarchive ? req.billfoodorderarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  billfoodorderarchive.isCurrentUserOwner = req.user && billfoodorderarchive.user && billfoodorderarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(billfoodorderarchive);
};

/**
 * Update a billfoodorderarchive
 */
/* exports.update = function(req, res) {

  var billfoodorderarchive = req.billfoodorderarchive;

  billfoodorderarchive = _.extend(billfoodorderarchive, req.body);

  billfoodorderarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billfoodorderarchive);
    }
  });
}; */

/**
 * Delete an billfoodorderarchive
 */
/* exports.delete = function(req, res) {
  var billfoodorderarchive = req.billfoodorderarchive;

  billfoodorderarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billfoodorderarchive);
    }
  });
}; */

/**
 * List of billfoodorderarchive
 */
exports.list = function(req, res) {
  // console.log(req.query.billRentalArchive);
  if (req.query.billRentalArchive) {
    req.db.Billfoodorderarchive.find({ billRentalArchive: req.query.billRentalArchive }).sort('-created').exec(function(err, billfoodorderarchives) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(documents);
        var opts = {
          model: 'User',
          path: 'user'
        };
        User.populate(billfoodorderarchives, opts, function (err, billfoodorderarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(billfoodorderarchives);
          }
        });
      }
    });
  } else {
    req.db.Billfoodorderarchive.find().sort('-created').exec(function(err, billfoodorderarchives) {
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
        User.populate(billfoodorderarchives, opts1, function (err, billfoodorderarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(billfoodorderarchives);
          }
        });
      }
    });
  }
};

/**
 * billfoodorderarchive middleware
 */
exports.billfoodorderarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'bill food order archive is invalid'
    });
  }

  req.db.Billfoodorderarchive.findById(id).exec(function (err, billfoodorderarchive) {
    if (err) {
      return next(err);
    } else if (!billfoodorderarchive) {
      return res.status(404).send({
        message: 'No bill archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billfoodorderarchive, opts, function (err, billfoodorderarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billfoodorderarchive = billfoodorderarchive;
          next();
        }
      });
    }
  });
};
