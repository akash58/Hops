'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // PackageOrder = mongoose.model('PackageOrder'),
  _ = require('lodash');

/**
 * Create a PackageOrder
 */
exports.create = function(req, res) {
  var packageOrder = new req.db.Packageorder(req.body);

  packageOrder.user = req.user;

  packageOrder.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(packageOrder);
    }
  });
};

/**
 * Show the current packageOrder
 */
exports.read = function(req, res) {
  res.json(req.packageOrder);
};

/**
 * Update a packageOrder
 */
exports.update = function(req, res) {
  var packageOrder = req.packageOrder;

  packageOrder = _.extend(packageOrder, req.body);

  packageOrder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(packageOrder);
    }
  });
};

/**
 * Delete a packageOrder
 */
exports.delete = function(req, res) {
  var packageOrder = req.packageOrder;

  packageOrder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(packageOrder);
    }
  });
};

/**
 * List of packageOrder
 */
exports.list = function(req, res) {
  if (req.query.findByRental) {
    req.db.Packageorder.find({ rental: req.query.findByRental }).sort('created').populate('package').exec(function(err, packageorders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'Category',
          path: 'package.category'
          // select: 'productNumber component'
        };
        req.db.Packageorder.populate(packageorders, opts, function (err, rentals) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts1 = {
              model: 'User',
              path: 'user'
            };
            User.populate(packageorders, opts1, function (err, packageorders) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.json(packageorders);
              }
            });
          }
        });
      }
    });
  } else {
    req.db.Packageorder.find().sort('created').populate('package').exec(function(err, packageorders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'Category',
          path: 'package.category'
          // select: 'productNumber component'
        };
        req.db.Packageorder.populate(packageorders, opts, function (err, rentals) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts1 = {
              model: 'User',
              path: 'user'
            };
            User.populate(packageorders, opts1, function (err, packageorders) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.json(packageorders);
              }
            });
          }
        });
      }
    });
  }
};

/**
 * packageorders middleware
 */
exports.packageorderById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Package Order is invalid'
    });
  }

  req.db.Packageorder.findById(id).exec(function (err, packageOrder) {
    if (err) {
      return next(err);
    } else if (!packageOrder) {
      return res.status(404).send({
        message: 'No Package Order with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(packageOrder, opts, function (err, packageOrder) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.packageOrder = packageOrder;
          next();
        }
      });
    }
  });
};
