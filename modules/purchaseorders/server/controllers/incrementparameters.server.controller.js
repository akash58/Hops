'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a IncrementParameter
 */

exports.create = function(req, res) {
  var incrementParameter = new req.db.Incrementparameter(req.body);
  incrementParameter.user = req.user;

  incrementParameter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(incrementParameter);
    }
  });
};


/**
 * Show the current incrementParameter
 */

exports.read = function(req, res) {
  // convert mongoose document to JSON
  var incrementParameter = req.incrementparameter ? req.incrementparameter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  incrementParameter.isCurrentUserOwner = req.user && incrementParameter.user && incrementParameter.user._id.toString() === req.user._id.toString();

  res.jsonp(incrementParameter);
};

/**
 * Update a incrementParameter
 */

exports.update = function(req, res) {
  var incrementParameter = req.incrementparameter;

  incrementParameter = _.extend(incrementParameter, req.body);

  incrementParameter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(incrementParameter);
    }
  });
};


/* exports.update = function(req, res) {
	var incrementParameter = req.incrementparameter;

	incrementParameter = _.extend(incrementParameter, req.body);

	incrementParameter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(incrementParameter);
		}
	});
}; */

/**
 * Delete a incrementParameter
 */
/* exports.delete = function(req, res) {
	var incrementParameter = req.incrementParameter;

	incrementParameter.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(incrementParameter);
		}
	});
}; */

/**
 * List of paymentincrementParameter
 */
exports.list = function(req, res) {
  req.db.Incrementparameter.find().sort('created').populate('user').exec(function(err, incrementparameters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(incrementparameters);
    }
  });
};

/**
 * incrementParameter middleware
 */
exports.incrementParameterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: '.Increment parameter is invalid'
    });
  }

  req.db.Incrementparameter.findById(id).populate('user', 'displayName').exec(function (err, incrementparameter) {
    if (err) {
      return next(err);
    } else if (!incrementparameter) {
      return res.status(404).send({
        message: 'No Increment parameter with that identifier has been found'
      });
    }
    req.incrementparameter = incrementparameter;
    next();
  });
};
