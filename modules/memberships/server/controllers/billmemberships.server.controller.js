'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Billmembership
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billMembership = new req.db.Billmembership(req.body);

  billMembership.user = req.user;

  // console.log(foodOrderActivity);

  billMembership.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billMembership);
    }
  });
};

/**
 * Show the current billMembership
 */
exports.read = function(req, res) {
  res.json(req.billMembership);
};

/**
 * Update a billMembership
 */
/* exports.update = function(req, res) {

  var billMembership = req.billMembership;

  billMembership = _.extend(billMembership, req.body);

  billMembership.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billMembership);
    }
  });
}; */

/**
 * Delete an billMembership
 */
exports.delete = function(req, res) {
  var billMembership = req.billMembership;

  billMembership.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billMembership);
    }
  });
};

/**
 * List of billMembership
 */
exports.list = function(req, res) {
  console.log('work');
  req.db.Billmembership.find().sort('-created').populate('bill').populate('membershipactivity').exec(function(err, billMemberships) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts = {
        model: 'Customer',
        path: 'membershipactivity.customer'
      };
      req.db.Billmembership.populate(billMemberships, opts, function (err, billMemberships) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(billMemberships, opts1, function (err, billMemberships) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(billMemberships);
            }
          });
        }
      });
    }
  });
};

/**
 * billMembership middleware
 */
exports.billMembershipByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill Membership is invalid'
    });
  }

  req.db.Billmembership.findById(id).exec(function (err, billMembership) {
    if (err) {
      return next(err);
    } else if (!billMembership) {
      return res.status(404).send({
        message: 'No Bill Membership with that identifier has been found'
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(billMembership, opts1, function (err, billMembership) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billMembership = billMembership;
          next();
        }
      });
    }
  });
};
