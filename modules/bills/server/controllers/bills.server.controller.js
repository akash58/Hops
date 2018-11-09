'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bill
 */
// function checkIfRentalAllreadyBill (req, res) {
//   return new Promise(function (resolve, reject) {
//     var rentalIds = [];

//     req.db.rentals.find({  }).exec(function (err, rentals) {
//       if (err) {
//         reject(err);
//         // return res.status(422).send({
//         //   message: errorHandler.getErrorMessage(err)
//         // });
//       } else {

//         resolve();
//       }
//     });
//   });
// }

exports.create = function (req, res) {
  var bill = new req.db.Bill(req.body);
  bill.user = req.user;

  bill.save(function (err) {
    if (err) {
      // console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill);
    }
  });
};

/**
 * Show the current Rental
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bill = req.bill ? req.bill.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bill.isCurrentUserOwner = !!(req.user && bill.user && bill.user._id.toString() === req.user._id.toString());

  res.json(bill);
};

/**
 * Update an Rental
 */
exports.update = function (req, res) {
  var bill = req.bill;

  bill.title = req.body.title;
  bill.content = req.body.content;

  bill.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill);
    }
  });
};

/**
 * Delete an bill
 */
exports.delete = function (req, res) {
  var bill = req.bill;

  bill.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill);
    }
  });
};

/**
 * List of Rentals
 */
exports.list = function (req, res) {
  if (req.query.table) {
    req.db.Bill.find({ table: req.query.table }).sort('-created').populate('customer').populate('table').exec(function (err, bills) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opt = {
          model: 'User',
          path: 'attendant'
        };
        User.populate(bills, opt, function(err, documents) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            // console.log(paymentBill);
            var opts1 = {
              model: 'User',
              path: 'user'
            };
            User.populate(documents, opts1, function (err, documents) {
              // console.log(opts1);
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(documents);
              }
            });
          }
        });
        // res.json(rentals);
      }
    });
  } else {
    req.db.Bill.find().sort('-created').populate('customer').populate('table').exec(function (err, bills) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(paymentBill);
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(bills, opts1, function (err, bills) {
          // console.log(opts1);
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts2 = {
              model: 'User',
              path: 'table.currentAttendant'
            };
            User.populate(bills, opts2, function (err, bills) {
              // console.log(opts2);
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(bills);
              }
            });
          }
        });
      }
    });
  }
};

/**
 * Bill middleware
 */
exports.billByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill is invalid'
    });
  }

  req.db.Bill.findById(id).exec(function (err, bill) {
    if (err) {
      return next(err);
    } else if (!bill) {
      return res.status(404).send({
        message: 'No Bill with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(bill, opts, function (err, bill) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.bill = bill;
          next();
        }
      });
    }
  });
};
