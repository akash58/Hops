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
  var unitType = new req.db.Unittype(req.body);
  var unit = new req.db.Unit();
  unitType.baseUnitId = unit._id;
  unitType.user = req.user;

  unitType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // res.jsonp(unitType);
      unit.name = unitType.baseUnitName;
      unit.unitType = unitType._id;
      unit.symbol = unitType.baseUnitSymbol;
      unit.multiplierWithBaseUnit = 1;
      unit.note = 'This unit is created by system but you can edit this';
      unit.save(function(errInUnit) {
        if (errInUnit) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(errInUnit)
          });
        } else {
          res.jsonp(unitType);
        }
      });
    }
  });
};

/**
 * Show the current Unit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var unitType = req.unitType ? req.unitType.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  unitType.isCurrentUserOwner = req.user && unitType.user && unitType.user._id.toString() === req.user._id.toString();

  res.jsonp(unitType);
};

/**
 * Update a Unit
 */
exports.update = function(req, res) {
  var unitType = req.unitType;

  unitType = _.extend(unitType, req.body);

  unitType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(unitType);
    }
  });
};

/**
 * Delete an Unit
 */
exports.delete = function(req, res) {
  var unitType = req.unitType;

  unitType.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(unitType);
    }
  });
};

/**
 * List of Units
 */
exports.list = function(req, res) {
  if (req.query.baseUnit) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Unittype.find({ $and: [{ active: true }, { baseUnitSymbol: { $regex: new RegExp(req.query.baseUnit.toLowerCase(), 'i') } }] }).sort('-created').populate('baseUnitId').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, unitTypes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(unitTypes);
      }
    });
  } else if (req.query.name) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Unittype.find({ $and: [{ active: true }, { name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }] }).sort('-created').populate('baseUnitId').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, unitTypes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(unitTypes);
      }
    });
  } else {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Unittype.find({ active: true }).populate('baseUnitId').sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, unitTypes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(unitTypes);
      }
    });
  }
  // if (req.query.name) {
  //   req.db.Unittype.find({ $and: [{ name: req.query.name }, { active: true }] }).sort('-created').populate('baseUnitId').populate('user', 'displayName').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, unitTypes) {
  //     if (err) {
  //       return res.status(400).send({
  //         message: errorHandler.getErrorMessage(err)
  //       });
  //     } else {
  //       res.jsonp(unitTypes);
  //     }
  //   });
  // } else {
  //   req.db.Unittype.find({ active: true }).sort('-created').populate('user', 'displayName').populate('baseUnitId').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, unitTypes) {
  //     if (err) {
  //       return res.status(400).send({
  //         message: errorHandler.getErrorMessage(err)
  //       });
  //     } else {
  //       res.jsonp(unitTypes);
  //     }
  //   });
  // }
};

exports.count = function(req, res) {
  if (req.query.name) {
    req.db.Unittype.count({ $and: [{ active: true }, { name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }] }).exec(function(err, Unittype_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(Unittype_count);
        res.send({ count: Unittype_count });
      }
    });
  } else {
    req.db.Unittype.count({ active: true }).exec(function(err, Unittype_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(Unittype_count);
        res.send({ count: Unittype_count });
      }
    });
  }
};

/**
 * Unit middleware
 */
exports.unitTypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Unit Type is invalid'
    });
  }

  req.db.Unittype.findById(id).populate('user', 'displayName').exec(function (err, unitType) {
    if (err) {
      return next(err);
    } else if (!unitType) {
      return res.status(404).send({
        message: 'No Unit type with that identifier has been found'
      });
    }
    req.unitType = unitType;
    next();
  });
};
