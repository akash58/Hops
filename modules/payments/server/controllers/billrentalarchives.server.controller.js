'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  // Billrentalarchive = mongoose.model('Billrentalarchive'),
  _ = require('lodash');

/**
 * Create a Bill Rental Archive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billrentalarchive = new req.db.Billrentalarchive(req.body);

  billrentalarchive.user = req.user;

  // console.log(billrentalarchive);

  billrentalarchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(billrentalarchive);
    }
  });
};

/**
 * Show the current billrentalarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billrentalarchive = req.billrentalarchive ? req.billrentalarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  billrentalarchive.isCurrentUserOwner = req.user && billrentalarchive.user && billrentalarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(billrentalarchive);
};

/**
 * Update a billrentalarchive
 */
/* exports.update = function(req, res) {

  var billrentalarchive = req.billrentalarchive;

  billrentalarchive = _.extend(billrentalarchive, req.body);

  billrentalarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billrentalarchive);
    }
  });
}; */

/**
 * Delete an billrentalarchive
 */
/* exports.delete = function(req, res) {
  var billrentalarchive = req.billrentalarchive;

  billrentalarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billrentalarchive);
    }
  });
}; */

/**
 * List of billrentalarchive
 */
exports.list = function(req, res) {

  if (req.query.billIdArray) {
    req.db.Billrentalarchive.find({ bill: { $in: req.query.billIdArray } }).sort('-created').populate('rentalArchive').exec(function(err, billrentalarchives) {
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
        User.populate(billrentalarchives, opts1, function (err, billrentalarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(billrentalarchives);
          }
        });
      }
    });
  } else if (req.query.bill) {
    // console.log(req.query.bill);
    req.db.Billrentalarchive.find({ bill: req.query.bill }).sort('-created').populate('rentalArchive').populate('billArchive').exec(function(err, billrentalarchives) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'Customer',
          path: 'rentalArchive.customer'
          // select: 'productNumber component'
        };
        req.db.Billrentalarchive.populate(billrentalarchives, opts, function (err, billrentalarchives) {
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
            User.populate(billrentalarchives, opts1, function (err, billrentalarchives) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(billrentalarchives);
              }
            });
          }
        });
      }
    });
  } else {
    req.db.Billrentalarchive.find().sort('-created').populate('user').exec(function(err, billrentalarchives) {
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
        User.populate(billrentalarchives, opts1, function (err, billrentalarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(billrentalarchives);
          }
        });
      }
    });
  }

};

/**
 * billrentalarchive middleware
 */
exports.billrentalarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'bill rental archive is invalid'
    });
  }

  req.db.Billrentalarchive.findById(id).exec(function (err, billrentalarchive) {
    if (err) {
      return next(err);
    } else if (!billrentalarchive) {
      return res.status(404).send({
        message: 'No bill rental archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billrentalarchive, opts, function (err, billrentalarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billrentalarchive = billrentalarchive;
          next();
        }
      });
    }
  });
};
