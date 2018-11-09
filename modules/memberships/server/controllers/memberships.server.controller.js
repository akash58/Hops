'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Membership = mongoose.model('Membership'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Membership
 */
exports.create = function(req, res) {
  var membership = new req.db.Membership(req.body);
  membership.user = req.user;

  membership.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(membership);
    }
  });
};

/**
 * Show the current Membership
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var membership = req.membership ? req.membership.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  membership.isCurrentUserOwner = req.user && membership.user && membership.user._id.toString() === req.user._id.toString();

  res.jsonp(membership);
};

/**
 * Update a Membership
 */
exports.update = function(req, res) {
  var membership = req.membership;

  membership = _.extend(membership, req.body);

  membership.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(membership);
    }
  });
};

/**
 * Delete an Membership
 */
exports.delete = function(req, res) {
  var membership = req.membership;

  membership.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(membership);
    }
  });
};

/**
 * List of Memberships
 */
exports.list = function(req, res) {
  if (req.query.billNumber) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Membership.find({ billNumber: req.query.billNumber }).sort('-created').populate('customer').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, memberships) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(memberships, opts1, function (err, memberships) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(memberships);
          }
        });
      }
    });
  } else {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Membership.find().sort('-created').populate('customer').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, memberships) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(memberships, opts1, function (err, memberships) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(memberships);
          }
        });
      }
    });
  }
};

/**
 * Membership middleware
 */
exports.membershipByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Membership is invalid'
    });
  }

  req.db.Membership.findById(id).exec(function (err, membership) {
    if (err) {
      return next(err);
    } else if (!membership) {
      return res.status(404).send({
        message: 'No Membership with that identifier has been found'
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(membership, opts1, function (err, membership) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.membership = membership;
          next();
        }
      });
    }
  });
};
