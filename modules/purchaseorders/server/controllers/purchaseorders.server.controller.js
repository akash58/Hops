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
  * Create a PurchaseOrder
*/

exports.createPurchaseorder = function(req, res) {
  var purchaseorder = new req.db.Purchaseorder(req.body);
  purchaseorder.user = req.user;

  purchaseorder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(purchaseorder);
    }
  });
};


/**
  * Show the current purchaseorder
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var purchaseorder = req.purchaseorder ? req.purchaseorder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  purchaseorder.isCurrentUserOwner = req.user && purchaseorder.user && purchaseorder.user._id.toString() === req.user._id.toString();

  res.jsonp(purchaseorder);
};

/**
  * Update a purchaseorder
*/
/* exports.update = function(req, res) {
  var food = req.food;

  food = _.extend(food, req.body);

  food.save(function(err) {
  if (err) {
  return res.status(400).send({
  message: errorHandler.getErrorMessage(err)
  });
  } else {
  res.jsonp(food);
  }
  });
}; */

/**
  * Delete an purchaseorder
*/
/* exports.delete = function(req, res) {
  var food = req.food;

  food.remove(function(err) {
  if (err) {
  return res.status(400).send({
  message: errorHandler.getErrorMessage(err)
  });
  } else {
  res.jsonp(food);
  }
  });
}; */

/**
  * List of purchaseorder
*/
exports.listPurchaseOrders = function(req, res) {
  if (req.query.searchText) {
    req.db.Purchaseorder.find({ purchaseOrderNumber: req.query.searchText }).sort('-created').populate('supplier').skip((req.query.page - 1) * 10).limit(10).exec(function(err, purchaseorders) {
      if (err) {
				// console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'User',
          path: 'user'
        };
        User.populate(purchaseorders, opts, function (err, purchaseorders) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(purchaseorders);
          }
        });
      }
    });
  } else {
    req.db.Purchaseorder.find().sort('-created').populate('displayName').populate('supplier').skip((req.query.page - 1) * 10).limit(10).exec(function(err, purchaseorders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(purchaseorders, opts1, function (err, purchaseorders) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(purchaseorders);
          }
        });
      }
    });
  }
};

/**
  * Count of serial
*/
exports.count = function(req, res) {
	// console.log(req.query);
	// console.log(req.query.searchText);
  if (req.query.searchText) {
    req.db.Purchaseorder.count({ purchaseOrderNumber: req.query.searchText }).exec(function(err, purchaseorders_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d purchaseorders', purchaseorders_count);
        res.send({ count: purchaseorders_count });
      }
    });
  } else {
    req.db.Purchaseorder.count().exec(function(err, purchaseorders_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d purchaseorders', purchaseorders_count);
        res.send({ count: purchaseorders_count });
      }
    });
  }
};

/**
  * purchaseorder middleware
*/
exports.purchaseorderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Purchase order is invalid'
    });
  }

  req.db.Purchaseorder.findById(id).exec(function (err, purchaseorder) {
    if (err) {
      return next(err);
    } else if (!purchaseorder) {
      return res.status(404).send({
        message: 'No purchase order with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(purchaseorder, opts, function (err, purchaseorder) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.purchaseorder = purchaseorder;
          next();
        }
      });
    }
  });
};
