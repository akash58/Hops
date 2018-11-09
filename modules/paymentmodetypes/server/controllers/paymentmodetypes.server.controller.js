'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Baseunit = mongoose.model('Baseunit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a paymentModeType
 */
exports.create = function(req, res) {
  var paymentModeType = new req.db.Paymentmodetype(req.body);
  paymentModeType.user = req.user;

  paymentModeType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentModeType);
    }
  });
};

/**
 * Show the current paymentModeType
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var paymentModeType = req.paymentModeType ? req.paymentModeType.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  paymentModeType.isCurrentUserOwner = req.user && paymentModeType.user && paymentModeType.user._id.toString() === req.user._id.toString();

  res.jsonp(paymentModeType);
};

/**
 * Update a Baseunit
 */
exports.update = function(req, res) {
  var paymentModeType = req.paymentModeType;

  paymentModeType = _.extend(paymentModeType, req.body);

  paymentModeType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentModeType);
    }
  });
};

/**
 * Delete an Baseunit
 */
/* exports.delete = function(req, res) {
  var baseunit = req.baseunit;

  baseunit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(baseunit);
    }
  });
};
 */
/**
 * List of Baseunits
 */
exports.list = function(req, res) {
  req.db.Paymentmodetype.find().sort('created').exec(function(err, paymentmodetypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(paymentmodetypes);
    }
  });
};


/**
 * paymentModeType middleware
 */
exports.paymentModeTypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'payment modetype is invalid'
    });
  }

  req.db.Paymentmodetype.findById(id).populate('user', 'displayName').exec(function (err, paymentModeType) {
    if (err) {
      return next(err);
    } else if (!paymentModeType) {
      return res.status(404).send({
        message: 'No payment modetype with that identifier has been found'
      });
    }
    req.paymentModeType = paymentModeType;
    next();
  });
};
