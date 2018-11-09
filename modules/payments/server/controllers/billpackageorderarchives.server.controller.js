'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  // Billpackageorderarchive = mongoose.model('Billpackageorderarchive'),
  _ = require('lodash');

/**
 * Create a Bill Package-order Archive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billpackageorderarchive = new req.db.Billpackageorderarchive(req.body);

  billpackageorderarchive.user = req.user;

  // console.log(billpackageorderarchive);

  billpackageorderarchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billpackageorderarchive);
    }
  });
};

/**
 * Show the current BillPackageOrderarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billpackageorderarchive = req.billpackageorderarchive ? req.billpackageorderarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  billpackageorderarchive.isCurrentUserOwner = req.user && billpackageorderarchive.user && billpackageorderarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(billpackageorderarchive);
};

/**
 * Update a billpackageorderarchive
 */
/* exports.update = function(req, res) {

  var billpackageorderarchive = req.billpackageorderarchive;

  billpackageorderarchive = _.extend(billpackageorderarchive, req.body);

  billpackageorderarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billpackageorderarchive);
    }
  });
}; */

/**
 * Delete an billpackageorderarchive
 */
/* exports.delete = function(req, res) {
  var billpackageorderarchive = req.billpackageorderarchive;

  billpackageorderarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billpackageorderarchive);
    }
  });
}; */

/**
 * List of billpackageorderarchive
 */
exports.list = function(req, res) {
  if (req.query.billRentalArchive) {
    req.db.Billpackageorderarchive.find({ billRentalArchive: req.query.billRentalArchive }).sort('-created').exec(function(err, billpackageorderarchives) {
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
        User.populate(billpackageorderarchives, opts1, function (err, billpackageorderarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(billpackageorderarchives);
          }
        });
      }
    });
  } else {
    req.db.Billpackageorderarchive.find().sort('-created').exec(function(err, billpackageorderarchives) {
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
        User.populate(billpackageorderarchives, opts1, function (err, billpackageorderarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(billpackageorderarchives);
          }
        });
      }
    });
  }

};

/**
 * billpackageorderarchive middleware
 */
exports.billpackageorderarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'bill package order archive is invalid'
    });
  }

  req.db.Billpackageorderarchive.findById(id).exec(function (err, billpackageorderarchive) {
    if (err) {
      return next(err);
    } else if (!billpackageorderarchive) {
      return res.status(404).send({
        message: 'No bill package order archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billpackageorderarchive, opts, function (err, billpackageorderarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billpackageorderarchive = billpackageorderarchive;
          next();
        }
      });
    }
  });
};
