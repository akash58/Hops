'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Stockaudit = mongoose.model('Stockaudit'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Payment
 */
exports.create = function(req, res) {
  var payment = new req.db.Payment(req.body);

  payment.user = req.user;

  payment.save(function(err) {
    if (err) {

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(payment);
    }
  });
};


/**
 * Show the current payment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var payment = req.payment ? req.payment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  payment.isCurrentUserOwner = req.user && payment.user && payment.user._id.toString() === req.user._id.toString();

  res.jsonp(payment);
};

/**
 * Update a payment
 */
exports.update = function(req, res) {
  var payment = req.payment;

  payment = _.extend(payment, req.body);

  payment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(payment);
    }
  });
};

/**
 * Delete a payment
 */
exports.delete = function(req, res) {
  var payment = req.payment;

  payment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(payment);
    }
  });
};
/**
 * List of Stockaudits
 */
exports.list = function(req, res) {
  req.query.limit = Number(req.query.limit) || 10;
  req.query.page = Number(req.query.page) || 1;
  if (req.query.paymentReferenceNo) {
    req.db.Payment.find({ paymentReferenceNo: req.query.paymentReferenceNo }).sort('-created').populate('paymentModeType').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, payments) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(documents);
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(payments, opts1, function (err, payments) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(payments);
          }
        });
      }
    });
  } else {
    req.db.Payment.find().sort('-created').populate('paymentModeType').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, payments) {
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
        User.populate(payments, opts1, function (err, payments) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(payments);
          }
        });
      }
    });
  }
};


/**
 * Count of stockaudits
 */
exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  if (req.query.paymentReferenceNo) {
    req.db.Payment.count({ paymentReferenceNo: req.query.paymentReferenceNo }).exec(function(err, payments_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d payments', payments_count);
        res.send({ count: payments_count });
      }
    });
  } else {
    req.db.Payment.count().exec(function(err, payments_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d payments', payments_count);
        res.send({ count: payments_count });
      }
    });
  }
};

/**
 * Payment middleware
 */
exports.paymentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'payment is invalid'
    });
  }

  req.db.Payment.findById(id).exec(function (err, payment) {
    if (err) {
      return next(err);
    } else if (!payment) {
      return res.status(404).send({
        message: 'No payment with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(payment, opts, function (err, payment) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.payment = payment;
          next();
        }
      });
    }
  });
};
