'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // BillPackageOrder = mongoose.model('BillPackageOrder'),
  _ = require('lodash');

/**
 * Create a BillPackageOrder
 */
exports.create = function(req, res) {
  // console.log(req.body);
  var billPackageOrder = new req.db.Billpackageorder(req.body);
  billPackageOrder.user = req.user;
  // console.log(billPackageOrder);
  billPackageOrder.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billPackageOrder);
    }
  });
};

/**
 * Show the current billPackageOrder
 */
exports.read = function(req, res) {
  res.json(req.billPackageOrder);
};

/**
 * Update a billPackageOrder
 */
/* exports.update = function(req, res) {

	var billPackageOrder = req.billPackageOrder;

	billPackageOrder = _.extend(billPackageOrder, req.body);

	billPackageOrder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(billPackageOrder);
		}
	});
}; */

/**
 * Delete an billPackageOrder
 */
exports.delete = function(req, res) {
  var billPackageOrder = req.billPackageOrder;
  billPackageOrder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billPackageOrder);
    }
  });
};

/**
 * List of billPackageOrder
 */
exports.list = function(req, res) {
  req.db.Billpackageorder.find().sort('-created').exec(function(err, billPackageOrders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(billPackageOrders, opts1, function (err, billPackageOrders) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(billPackageOrders);
        }
      });
    }
  });
};

/**
 * billFoodOrder middleware
 */
exports.billPackageOrderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill PackageOrder is invalid'
    });
  }

  req.db.Billpackageorder.findById(id).exec(function (err, billPackageOrder) {
    if (err) {
      return next(err);
    } else if (!billPackageOrder) {
      return res.status(404).send({
        message: 'No Bill PackageOrder with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billPackageOrder, opts, function (err, billPackageOrder) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billPackageOrder = billPackageOrder;
          next();
        }
      });
    }
  });
};
