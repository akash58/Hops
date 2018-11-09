'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // BillFoodOrder = mongoose.model('BillFoodOrder'),
  _ = require('lodash');

/**
 * Create a FoodOrderActivity
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billFoodOrder = new req.db.Billfoodorder(req.body);

  billFoodOrder.user = req.user;

  // console.log(foodOrderActivity);

  billFoodOrder.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billFoodOrder);
    }
  });
};

/**
 * Show the current billFoodOrder
 */
exports.read = function(req, res) {
  res.json(req.billFoodOrder);
};

/**
 * Update a billFoodOrder
 */
/* exports.update = function(req, res) {

	var billFoodOrder = req.billFoodOrder;

	billFoodOrder = _.extend(billFoodOrder, req.body);

	billFoodOrder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(billFoodOrder);
		}
	});
};
 */
/**
 * Delete an billFoodOrder
 */
exports.delete = function(req, res) {
  var billFoodOrder = req.billFoodOrder;
  billFoodOrder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billFoodOrder);
    }
  });
};

/**
 * List of billFoodOrder
 */
exports.list = function(req, res) {
  req.db.Billfoodorder.find().sort('-created').exec(function(err, billFoodOrders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(billFoodOrders, opts1, function (err, billFoodOrders) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(billFoodOrders);
        }
      });
    }
  });
};

/**
 * billFoodOrder middleware
 */
exports.billFoodOrderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill FoodOrder is invalid'
    });
  }

  req.db.Billfoodorder.findById(id).exec(function (err, billFoodOrder) {
    if (err) {
      return next(err);
    } else if (!billFoodOrder) {
      return res.status(404).send({
        message: 'No Bill FoodOrder with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billFoodOrder, opts, function (err, billFoodOrder) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billFoodOrder = billFoodOrder;
          next();
        }
      });
    }
  });
};
