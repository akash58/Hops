'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an foodorder
 */
exports.create = function (req, res) {
  var foodorder = new req.db.Foodorder(req.body);
  foodorder.user = req.user;

  foodorder.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(foodorder);
    }
  });
};

exports.saveAll = function (req, res) {
  req.db.Foodorder.insertMany(req.body.foodorders, function(err, docs) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({ docs: docs });
    }
  });
};
/**
 * Show the current Rental
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var foodorder = req.foodorder ? req.foodorder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  foodorder.isCurrentUserOwner = !!(req.user && foodorder.user && foodorder.user._id.toString() === req.user._id.toString());

  res.json(foodorder);
};

/**
 * Update an Rental
*/
exports.update = function (req, res) {
  var foodorder = req.foodorder;

  foodorder = _.extend(foodorder, req.body);

  foodorder.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(foodorder);
    }
  });
};

/**
 * Delete an foodorder
 */
exports.delete = function (req, res) {
  var foodorder = req.foodorder;

  foodorder.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(foodorder);
    }
  });
};

/**
 * List of Rentals
 */
exports.list = function (req, res) {
  if (req.query.rental) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Foodorder.find({ rental: req.query.rental }).sort('-created').populate('food').populate('rental').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function (err, foodorders) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opt = {
          model: 'User',
          path: 'rental.attendant'
        };
        User.populate(foodorders, opt, function(err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts1 = {
              model: 'User',
              path: 'user'
            };
            User.populate(documents, opts1, function (err, populateddocuments) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var opts2 = {
                  model: 'Foodtype',
                  path: 'food.foodtype'
                };
                req.db.Foodtype.populate(populateddocuments, opts2, function(err, foodtypePopulated) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(foodtypePopulated);
                  }
                });
                // res.json(documents);
              }
            });
          }
        });
        // res.json(foodorders);
      }
    });
  } else {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Foodorder.find().sort('-created').populate('rental').populate('table').populate('food').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function (err, foodorders) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(paymentBill);
        var opts1 = {
          model: 'User',
          path: 'rental.attendant'
        };
        User.populate(foodorders, opts1, function (err, foodorders) {
          // console.log(opts1);
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts1 = {
              model: 'User',
              path: 'user'
            };
            User.populate(foodorders, opts1, function (err, foodorders) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var opts2 = {
                  model: 'Foodtype',
                  path: 'food.foodtype'
                };
                req.db.Foodtype.populate(foodorders, opts2, function(err, foodtypePopulated) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(foodtypePopulated);
                  }
                });
                // res.json(foodorders);
              }
            });
          }
        });
      }
    });
  }
};

/**
 * foodorder middleware
 */

exports.count = function(req, res) {
  req.db.Foodorder.count().exec(function(err, document) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send({ count: document });
    }
  });
};

exports.foodorderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Foodorder is invalid'
    });
  }

  req.db.Foodorder.findById(id).exec(function (err, foodorder) {
    if (err) {
      return next(err);
    } else if (!foodorder) {
      return res.status(404).send({
        message: 'No Foodorder with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(foodorder, opts, function (err, foodorder) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.foodorder = foodorder;
          next();
        }
      });
    }
  });
};
