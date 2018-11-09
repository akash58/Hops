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
exports.createFoodExpiryInventoryActivity = function(req, res) {
  // console.log(req.body);

  var document = new req.db.Foodexpiryniventoryactivity(req.body);

  document.user = req.user;

  // console.log(document);

  document.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(document);
    }
  });
};

/**
 * Show the current Document
 */
exports.readFoodExpiryInventoryActivity = function(req, res) {
  // convert mongoose document to JSON
  var document = req.document ? req.document.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  document.isCurrentUserOwner = req.user && document.user && document.user._id.toString() === req.user._id.toString();

  res.jsonp(document);
};

/**
 * Update a Document
 */
/* exports.updateFoodExpiryInventoryActivity = function(req, res) {

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
/* exports.deleteFoodExpiryInventoryActivity = function(req, res) {
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
}; */

/**
 * List of Document
 */
exports.listFoodExpiryInventoryActivitys = function(req, res) {
  if (req.query.foodExpiry) {
    req.db.Foodexpiryniventoryactivity.find({ foodExpiry: req.query.foodExpiry }).sort('-created').populate('foodExpiry').populate('inventoryActivity').exec(function(err, documents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'FoodComponent',
          path: 'inventoryActivity.foodcomponent'
          // select: 'productNumber component'
        };
        req.db.Foodexpiryniventoryactivity.populate(documents, opts, function (err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts = {
              model: 'Unittype',
              path: 'inventoryActivity.foodcomponent.baseUnit'
            };
            req.db.Foodexpiryniventoryactivity.populate(documents, opts, function (err, documents) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var opts = {
                  model: 'User',
                  path: 'user'
                };
                User.populate(documents, opts, function (err, documents) {
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
  } else {
    req.db.Foodexpiryniventoryactivity.find().sort('-created').populate('foodExpiry').populate('inventoryActivity').exec(function(err, documents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'FoodComponent',
          path: 'inventoryActivity.foodcomponent'
          // select: 'productNumber component'
        };
        req.db.Foodexpiryniventoryactivity.populate(documents, opts, function (err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts = {
              model: 'User',
              path: 'user'
            };
            User.populate(documents, opts, function (err, documents) {
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
exports.foodExpiryInventoryActivityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Food Expiry Inventory Activity is invalid'
    });
  }

  req.db.Foodexpiryniventoryactivity.findById(id).exec(function (err, document) {
    if (err) {
      return next(err);
    } else if (!document) {
      return res.status(404).send({
        message: 'No Food Expiry Inventory Activity with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(document, opts, function (err, document) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.document = document;
          next();
        }
      });
    }
  });
};

// exports.foodExpiryInventoryActivityByID = function(req, res, next, id) {
//   req.db.Foodexpiryniventoryactivity.findById(id).exec(function(err, document) {
//     if (err) return next(err);
//     if (!document) return next(new Error('Failed to load Food Expiry Inventory Activity ' + id));
//     req.document = document;
//     next();
//   });
// };
