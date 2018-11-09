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
exports.createFoodExpiry = function(req, res) {
  // console.log(req.body);

  var document = new req.db.Foodexpiry(req.body);

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
exports.readFoodExpiry = function(req, res) {
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
/* exports.updateFoodExpiry = function(req, res) {

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
/* exports.deleteFoodExpiry = function(req, res) {
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
exports.listFoodExpirys = function(req, res) {
  req.query.limit = Number(req.query.limit) || 10;
  req.query.page = Number(req.query.page) || 1;
  if (req.query.foodExpiryNumber) {
    req.db.Foodexpiry.find({ foodExpiryNumber: req.query.foodExpiryNumber }).sort('-created').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, foodexpirys) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'User',
          path: 'user'
        };
        User.populate(foodexpirys, opts, function (err, foodexpirys) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(foodexpirys);
          }
        });
      }
    });
  } else {
    req.db.Foodexpiry.find().sort('-created').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, foodexpirys) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'User',
          path: 'user'
        };
        User.populate(foodexpirys, opts, function (err, foodexpirys) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(foodexpirys);
          }
        });
      }
    });
  }
};

/**
 * Count of foodexpirys
 */
exports.count = function(req, res) {

  if (req.query.foodExpiryNumber) {
    req.db.Foodexpiry.count({ foodExpiryNumber: req.query.foodExpiryNumber }).exec(function(err, foodexpirys_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: foodexpirys_count });
      }
    });
  } else {
    req.db.Foodexpiry.count().exec(function(err, foodexpirys_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: foodexpirys_count });
      }
    });
  }
};

/**
 * Document middleware
 */
exports.foodExpiryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Food Expiry is invalid'
    });
  }

  req.db.Foodexpiry.findById(id).exec(function (err, document) {
    if (err) {
      return next(err);
    } else if (!document) {
      return res.status(404).send({
        message: 'No Food Expiry with that identifier has been found'
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

// exports.foodExpiryByID = function(req, res, next, id) {
//   req.db.Foodexpiry.findById(id).exec(function(err, document) {
//     if (err) return next(err);
//     if (!document) return next(new Error('Failed to load Food Expiry ' + id));
//     req.document = document;
//     next();
//   });
// };
