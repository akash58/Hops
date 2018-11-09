'use strict';

/**
  * Module dependencies.
*/
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
  * Create a document
*/
exports.createPurchaseOrderInventoryActivity = function(req, res) {
	// console.log(req.body);

  var purchaseOrderInventoryActivity = new req.db.Purchaseorderinventoryactivity(req.body);

  purchaseOrderInventoryActivity.user = req.user;

	// console.log(document);

  purchaseOrderInventoryActivity.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(purchaseOrderInventoryActivity);
    }
  });
};

/**
  * Show the current Document
*/
exports.readPurchaseOrderInventoryActivity = function(req, res) {

  // convert mongoose document to JSON
  var purchaseOrderInventoryActivity = req.purchaseOrderInventoryActivity ? req.purchaseOrderInventoryActivity.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  purchaseOrderInventoryActivity.isCurrentUserOwner = req.user && purchaseOrderInventoryActivity.user && purchaseOrderInventoryActivity.user._id.toString() === req.user._id.toString();

  res.jsonp(purchaseOrderInventoryActivity);
};

/**
  * Update a Document
*/
/* exports.updatePurchaseOrderInventoryActivity = function(req, res) {

	var document = req.document;

	document = _.extend(document, req.body);

	document.save(function(err) {
  if (err) {
  return res.status(400).send({
  message: errorHandler.getErrorMessage(err)
  });
  } else {
  res.json(document);
  }
	});
}; */

/**
  * Delete an Document
*/
/* exports.deletePurchaseOrderInventoryActivity = function(req, res) {
	var document = req.document;

	document.remove(function(err) {
  if (err) {
  return res.status(400).send({
  message: errorHandler.getErrorMessage(err)
  });
  } else {
  res.json(document);
  }
	});
  };
*/
/**
  * List of Document
*/
exports.listPurchaseOrderInventoryActivitys = function(req, res) {
  /* console.log('IN');
  console.log(req);*/
  if (req.query.purchaseOrder) {
    /* console.log('IN1......................');
    console.log(req.query.purchaseOrder);*/
    req.db.Purchaseorderinventoryactivity.find({ purchaseOrder: req.query.purchaseOrder }).sort('-created').populate('inventoryActivity').exec(function(err, documents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'FoodComponent',
          path: 'inventoryActivity.foodcomponent'
        };
        req.db.Purchaseorderinventoryactivity.populate(documents, opts, function (err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts2 = {
              model: 'Unittype',
              path: 'inventoryActivity.foodcomponent.baseUnit'
            };
            req.db.Purchaseorderinventoryactivity.populate(documents, opts2, function (err, documents) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var opts3 = {
                  model: 'Unit',
                  path: 'inventoryActivity.unitUsedForPrice'
                };
                req.db.Purchaseorderinventoryactivity.populate(documents, opts3, function (err, documents) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    var opts1 = {
                      model: 'User',
                      path: 'user'
                    };
                    User.populate(documents, opts1, function (err, documents) {
                      if (err) {
                        // console.log(err);
                        return res.status(400).send({
                          message: errorHandler.getErrorMessage(err)
                        });
                      } else {
                        res.jsonp(documents);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    req.db.Purchaseorderinventoryactivity.find().sort('-created').populate('inventoryActivity').populate('purchaseOrder').exec(function(err, documents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts3 = {
          model: 'FoodComponent',
          path: 'inventoryActivity.foodcomponent'
        };
        req.db.Purchaseorderinventoryactivity.populate(documents, opts3, function (err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts4 = {
              model: 'User',
              path: 'user'
            };
            User.populate(documents, opts4, function (err, documents) {
              if (err) {
                // console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(documents);
              }
            });
          }
        });
      }
    });
  }

};

/**
  * Document middleware
*/
exports.purchaseOrderInventoryActivityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'purchase order inventory activity is invalid'
    });
  }

  req.db.Purchaseorderinventoryactivity.findById(id).exec(function (err, purchaseOrderInventoryActivity) {
    if (err) {
      return next(err);
    } else if (!purchaseOrderInventoryActivity) {
      return res.status(404).send({
        message: 'No purchase order inventory activity with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(purchaseOrderInventoryActivity, opts, function (err, purchaseOrderInventoryActivity) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.purchaseOrderInventoryActivity = purchaseOrderInventoryActivity;
          next();
        }
      });
    }
  });
};
