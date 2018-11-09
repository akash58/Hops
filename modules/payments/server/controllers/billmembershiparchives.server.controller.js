'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  // Billmembershiparchive = mongoose.model('Billmembershiparchive'),
  _ = require('lodash');

/**
 * Create a Billmembershiparchive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billmembershiparchive = new req.db.Billmembershiparchive(req.body);

  billmembershiparchive.user = req.user;

  // console.log(billmembershiparchive);

  billmembershiparchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(billmembershiparchive);
    }
  });
};

/**
 * Show the current billmembershiparchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billmembershiparchive = req.billmembershiparchive ? req.billmembershiparchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  billmembershiparchive.isCurrentUserOwner = req.user && billmembershiparchive.user && billmembershiparchive.user._id.toString() === req.user._id.toString();

  res.jsonp(billmembershiparchive);
};

/**
 * Update a billmembershiparchive
 */
/* exports.update = function(req, res) {

  var billmembershiparchive = req.billmembershiparchive;

  billmembershiparchive = _.extend(billmembershiparchive, req.body);

  billmembershiparchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billmembershiparchive);
    }
  });
}; */

/**
 * Delete an billmembershiparchive
 */
/* exports.delete = function(req, res) {
  var billmembershiparchive = req.billmembershiparchive;

  billmembershiparchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billmembershiparchive);
    }
  });
}; */

/**
 * List of billmembershiparchive
 */
exports.list = function(req, res) {
  if (req.query.billArchive) {
    req.db.Billmembershiparchive.findOne({ billArchive: req.query.billArchive }).sort('-created').populate('membershipactivity').exec(function(err, billmembershiparchives) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'Customer',
          path: 'membershipactivity.customer'
        };
        req.db.Billmembershiparchive.populate(billmembershiparchives, opts, function (err, billmembershiparchives) {
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
            User.populate(billmembershiparchives, opts1, function (err, billmembershiparchives) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // res.json(billmembershiparchives);
                if (billmembershiparchives) {
                  res.jsonp(billmembershiparchives);
                } else {
                  res.jsonp();
                }
              }
            });
          }
        });
      }
    });
  } else {
    req.db.Billmembershiparchive.find().sort('-created').populate('billArchive').populate('membershipactivity').exec(function(err, billmembershiparchives) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'Customer',
          path: 'membershipactivity.customer'
        };
        req.db.Billmembershiparchive.populate(billmembershiparchives, opts, function (err, billmembershiparchives) {
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
            User.populate(billmembershiparchives, opts1, function (err, billmembershiparchives) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(billmembershiparchives);
              }
            });
          }
        });
      }
    });
  }
};

/**
 * billmembershiparchive middleware
 */
exports.billmembershiparchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill membership archive is invalid'
    });
  }

  req.db.Billmembershiparchive.findById(id).exec(function (err, billmembershiparchive) {
    if (err) {
      return next(err);
    } else if (!billmembershiparchive) {
      return res.status(404).send({
        message: 'No bill membership archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billmembershiparchive, opts, function (err, billmembershiparchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billmembershiparchive = billmembershiparchive;
          next();
        }
      });
    }
  });
};
