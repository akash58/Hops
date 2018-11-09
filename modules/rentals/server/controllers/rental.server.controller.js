'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  _ = require('lodash'),
  // Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an rental
 */
var updateSerialForRental = function (req, rental) {
  // return function() {
  return new Promise(function(resolve, reject) {
    // console.log('called');
    var serial = {
      // _id: rental.serial,
      renting: true
    };
    req.db.Serial.update({ _id: rental.serial }, { $set: serial }, function(err, data) {
      if (err) {
        // console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
  // };
  // console.log('called');
};
var updateTableForRental = function (req, rental) {
  // return function() {
  return new Promise(function(resolve, reject) {
    console.log(rental.attendant);
    var table = {
      status: 'busy',
      currentAttendant: rental.attendant
    };
    if (rental.serial) {
      table.serial = rental.serial;
      table.foodOnly = false;
    }
    req.db.Table.update({ _id: rental.table }, { $set: table }, function(err, data) {
      if (err) {
        // console.log(err);
        reject(err);
      } else {
        // console.log(data);
        resolve();
      }
    });
  });
  // };
};
exports.create = function (req, res) {
  var rental = new req.db.Rental(req.body);
  rental.user = req.user;

  rental.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (rental.serial) {
        updateSerialForRental(req, rental)
          .then(updateTableForRental(req, rental))
          .then(function() {
            res.json(rental);
          })
          .catch(function (err) {
            // console.log(err);
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
      } else {
        updateTableForRental(req, rental)
          .then(function () {
            res.json(rental);
          })
          .catch(function (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
      }
      // res.json(rental);
    }
  });
};

/**
 * Show the current Rental
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var rental = req.rental ? req.rental.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rental.isCurrentUserOwner = !!(req.user && rental.user && rental.user._id.toString() === req.user._id.toString());

  res.json(rental);
};

/**
 * Update an Rental
 */
exports.update = function (req, res) {
  var rental = req.rental;
  rental = _.extend(rental, req.body);
  // console.log(rental);
  // rental.title = req.body.title;
  // rental.content = req.body.content;
  // console.log(req.body);
  // rental.activeRental = req.body.activeRental;

  rental.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rental);
    }
  });
};

/**
 * Delete an Rental
 */
exports.delete = function (req, res) {
  var rental = req.rental;

  rental.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rental);
    }
  });
};

/**
 * List of Rentals
 */
exports.list = function (req, res) {
  if (req.query.table) {
    req.db.Rental.find({ table: req.query.table }).sort('-created').populate('table').populate('customer').populate('serial').populate('bill').exec(function (err, rentals) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opt = {
          model: 'User',
          path: 'attendant'
        };
        User.populate(rentals, opt, function(err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts = {
              model: 'Product',
              path: 'serial.product'
            };
            req.db.Rental.populate(rentals, opts, function (err, rentals) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var opts = {
                  model: 'Category',
                  path: 'serial.product.category'
                };
                req.db.Rental.populate(rentals, opts, function (err, rentals) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    var opts = {
                      model: 'User',
                      path: 'table.currentAttendant'
                    };
                    User.populate(documents, opts, function(err, populateDocuments) {
                      if (err) {
                        return res.status(400).send({
                          message: errorHandler.getErrorMessage(err)
                        });
                      } else {
                        var opts1 = {
                          model: 'User',
                          path: 'user'
                        };
                        User.populate(documents, opts1, function (err, populateDocuments) {
                          if (err) {
                            return res.status(400).send({
                              message: errorHandler.getErrorMessage(err)
                            });
                          } else {
                            console.log(populateDocuments);
                            res.json(populateDocuments);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
            // res.json(documents);
          }
        });
        // res.json(rentals);
      }
    });
  } else {
    req.db.Rental.find().sort('-created').populate('customer').populate('serial').exec(function (err, rentals) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(rentals, opts1, function (err, rentals) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(rentals);
          }
        });
      }
    });
  }
};

/**
 * Rental middleware
 */
exports.articleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rental is invalid'
    });
  }

  req.db.Rental.findById(id).exec(function (err, rental) {
    if (err) {
      return next(err);
    } else if (!rental) {
      return res.status(404).send({
        message: 'No rental with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(rental, opts, function (err, rental) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.rental = rental;
          next();
        }
      });
    }
  });
};
