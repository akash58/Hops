'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Systemparameter = mongoose.model('Systemparameter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Systemparameter
 */
exports.create = function(req, res) {
  var systemparameter = new req.db.Systemparameter(req.body);
  systemparameter.user = req.user;

  systemparameter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemparameter);
    }
  });
};
/**
* Insert many systemparameter
*/
exports.insertMany = function(req, res) {
  // console.log(req.db);
  req.db.Systemparameter.insertMany(req.body, function(err, docs) {
    if (err) {
      console.log(err);
      // return res.status(400).send({
      //   message: errorHandler.getErrorMessage(err)
      // });
    } else {
      // console.log('called');
      // console.log(docs);
      res.json({ docs: docs });
    }
  });
};
/**
 * Show the current Systemparameter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var systemparameter = req.systemparameter ? req.systemparameter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  systemparameter.isCurrentUserOwner = req.user && systemparameter.user && systemparameter.user._id.toString() === req.user._id.toString();

  res.jsonp(systemparameter);
};

/**
 * Update a Systemparameter
 */
exports.update = function(req, res) {
  var systemparameter = req.systemparameter;

  systemparameter = _.extend(systemparameter, req.body);

  systemparameter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemparameter);
    }
  });
};

/**
 * Delete an Systemparameter
 */
exports.delete = function(req, res) {
  var systemparameter = req.systemparameter;

  systemparameter.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(systemparameter);
    }
  });
};

/**
 * List of Systemparameters
 */
exports.list = function(req, res) {
  if (req.query.systemParameterName) {
    /* console.log(req.query.systemParameterName);*/
    req.db.Systemparameter.find({ systemParameterName: { $regex: new RegExp('^' + req.query.systemParameterName.toLowerCase(), 'i') } }).sort('-created').populate('user', 'displayName').skip((req.query.page - 1) * 10).limit(10).exec(function(err, systemparmeters) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(systemparmeters);
        res.json(systemparmeters);
      }
    });
  } else {
    // .skip((req.query.page - 1) * 10).limit(10)
    req.db.Systemparameter.find().sort('-created').populate('user', 'displayName').exec(function(err, systemparameters) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(systemparameters);
      }
    });
  }
};

/**
 * Count of Packages
 */
exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  if (req.query.systemParameterName) {
    // console.log('called');
    req.db.Systemparameter.count({ systemParameterName: { $regex: new RegExp('^' + req.query.systemParameterName.toLowerCase(), 'i') } }).exec(function(err, systemparmeters_count) {
      if (err) {
        // console.log('called');
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(typeof systemparmeters_count);
        // console.log('there are %d systemparmeters', systemparmeters_count);
        res.send({ count: systemparmeters_count });
      }
    });
  } else {
    req.db.Systemparameter.count().exec(function(err, systemparmeters_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(typeof systemparmeters_count);
        // console.log('there are %d systemparmeters', systemparmeters_count);
        res.send({ count: systemparmeters_count });
      }
    });
  }
};

/**
 * Systemparameter middleware
 */
exports.systemparameterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Systemparameter is invalid'
    });
  }

  req.db.Systemparameter.findById(id).populate('user', 'displayName').exec(function (err, systemparameter) {
    if (err) {
      return next(err);
    } else if (!systemparameter) {
      return res.status(404).send({
        message: 'No Systemparameter with that identifier has been found'
      });
    }
    req.systemparameter = systemparameter;
    next();
  });
};
