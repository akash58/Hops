'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Unit = mongoose.model('Unit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Unit
 */
exports.create = function(req, res) {
  var unit = new req.db.Unit(req.body);
  unit.user = req.user;

  unit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(unit);
    }
  });
};

/**
 * Show the current Unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var unit = req.unit ? req.unit.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  unit.isCurrentUserOwner = req.user && unit.user && unit.user._id.toString() === req.user._id.toString();

  res.jsonp(unit);
};

/**
 * Update a Unit
 */
exports.update = function(req, res) {
  var unit = req.unit;

  unit = _.extend(unit, req.body);

  unit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(unit);
    }
  });
};

/**
 * Delete an Unit
 */
exports.delete = function(req, res) {
  var unit = req.unit;

  unit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(unit);
    }
  });
};

/**
 * List of Units
 */
exports.list = function(req, res) {
  if (typeof(req.query.page) === 'undefined') req.query.page = 1;
  if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
  if (req.query.findByunitType && req.query.name) {
    req.db.Unit.find({ $and: [{ unitType: req.query.findByunitType }, { name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }, { active: true }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, units) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(units);
      }
    });
  } else if (req.query.findByunitType) {
    req.db.Unit.find({ $and: [{ unitType: req.query.findByunitType }, { active: true }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, units) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(units);
      }
    });
  } else if (req.query.name) {
    req.db.Unit.find({ $and: [{ name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }, { active: true }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, units) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(units);
      }
    });
  } else {
    req.db.Unit.find({ active: true }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, units) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(units);
      }
    });
  }
};

exports.count = function(req, res) {
  if (req.query.findByunitType && req.query.name) {
    req.db.Unit.count({ $and: [{ unitType: req.query.findByunitType }, { name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }, { active: true }] }).exec(function(err, Units_count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: Units_count });
      }
    });
  } else if (req.query.findByunitType) {
    req.db.Unit.count({ $and: [{ unitType: req.query.findByunitType }, { active: true }] }).sort('-created').exec(function(err, Units_count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: Units_count });
      }
    });
  } else if (req.query.name) {
    req.db.Unit.count({ $and: [{ name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }, { active: true }] }).exec(function(err, Units_count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: Units_count });
      }
    });
  } else {
    req.db.Unit.count({ active: true }).exec(function(err, Units_count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: Units_count });
      }
    });
  }
};

/**
 * Unit middleware
 */
exports.unitByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Unit is invalid'
    });
  }

  req.db.Unit.findById(id).populate('user', 'displayName').exec(function (err, unit) {
    if (err) {
      return next(err);
    } else if (!unit) {
      return res.status(404).send({
        message: 'No Unit with that identifier has been found'
      });
    }
    req.unit = unit;
    next();
  });
};
