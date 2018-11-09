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
 * Create a Table
 */
exports.create = function(req, res) {
  var table = new req.db.Table(req.body);
  table.user = req.user;
  if (!table.currentAttendant) {
    table.currentAttendant = req.user._id;
  }
  table.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(table);
    }
  });
};

/**
 * Show the current Table
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var table = req.table ? req.table.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  table.isCurrentUserOwner = req.user && table.user && table.user._id.toString() === req.user._id.toString();

  res.jsonp(table);
};

/**
 * Update a Table
 */
exports.update = function(req, res) {
  var table = req.table;

  table = _.extend(table, req.body);

  table.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(table);
    }
  });
};

/**
 * Delete an Table
 */
exports.delete = function(req, res) {
  var table = req.table;

  table.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(table);
    }
  });
};

/**
 * List of Tables
 */
exports.list = function(req, res) {
  if (req.query.tableNumber) {
    // console.log('called1');
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Table.find({ tableNumber: req.query.tableNumber }).sort('tableNumber').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).populate('serial').exec(function(err, tables) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opt = {
          model: 'User',
          path: 'currentAttendant'
        };
        User.populate(tables, opt, function(err, tables) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(tables);
          }
        });
      }
    });
  } if (req.query.availableTable) {
    // console.log('called2');
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Table.findOne({ status: req.query.availableTable }).sort('tableNumber').populate('serial').exec(function(err, table) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opt = {
          model: 'User',
          path: 'currentAttendant'
        };
        User.populate(table, opt, function(err, table) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            if (table == null || table === []) {
              req.db.Table.findOne().sort('-created').exec(function(err, table) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  var opt = {
                    model: 'User',
                    path: 'currentAttendant'
                  };
                  User.populate(table, opt, function(err, table) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      res.jsonp(table);
                    }
                  });
                }
              });
            } else {
              res.jsonp(table);
            }
          }
        });
      }
    });
  } else {
    // console.log('called3');
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Table.find().populate('serial').sort('tableNumber').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, tables) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opt = {
          model: 'User',
          path: 'currentAttendant'
        };
        User.populate(tables, opt, function(err, tables) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts = {
              model: 'Product',
              path: 'serial.product'
            };
            req.db.Product.populate(tables, opts, function(err, prodPopulatedDoc) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(prodPopulatedDoc);
                res.jsonp(prodPopulatedDoc);
              }
            });
            // res.jsonp(tables);
          }
        });
      }
    });
  }
};

exports.count = function(req, res) {
  req.db.Table.count().exec(function(err, document) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send({ count: document });
    }
  });
};

/**
 * Table middleware
 */
exports.tableByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Table is invalid'
    });
  }

  req.db.Table.findById(id).populate('user', 'displayName').exec(function (err, table) {
    if (err) {
      return next(err);
    } else if (!table) {
      return res.status(404).send({
        message: 'No Table with that identifier has been found'
      });
    }
    req.table = table;
    next();
  });
};
