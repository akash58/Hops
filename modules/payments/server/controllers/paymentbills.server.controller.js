'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  _ = require('lodash');

/**
 * Create a PaymentBill
 */
exports.create = function(req, res) {
  var paymentBill = new req.db.Paymentbill(req.body);

  // console.log('req.body : ');
  // console.log(req.body);

  paymentBill.user = req.user;


  paymentBill.save(function(err) {
    if (err) {

      // for to show error 400
      // console.log(err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(paymentBill);
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(paymentBill, opts1, function (err, paymentBill) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(paymentBill);
        }
      });
    }
  });
};

/**
 * Show the current paymentBill
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var paymentBill = req.paymentBill ? req.paymentBill.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  paymentBill.isCurrentUserOwner = req.user && paymentBill.user && paymentBill.user._id.toString() === req.user._id.toString();

  res.jsonp(req.paymentBill);
};

/**
 * Update a paymentBill
 */
exports.update = function(req, res) {
  var paymentBill = req.paymentBill;

  paymentBill = _.extend(paymentBill, req.body);

  paymentBill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentBill);
    }
  });
};

/**
 * Delete a paymentBill
 */
exports.delete = function(req, res) {
  var paymentBill = req.paymentBill;

  paymentBill.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentBill);
    }
  });
};

/**
 * List of paymentBill
 */
exports.list = function(req, res) {
  if (req.query.paymentID) {
    req.db.Paymentbill.find({ payment: req.query.paymentID }).sort('-created').populate('payment').populate('bill').populate('rental').populate('billrental').populate('table').exec(function(err, paymentbills) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'PaymentModeType',
          path: 'payment.paymentModeType'
        };
        req.db.Paymentbill.populate(paymentbills, opts, function (err, paymentbills) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts1 = {
              model: 'User',
              path: 'payment.paymentReceivedBy'
            };
            req.db.Paymentbill.populate(paymentbills, opts1, function (err, paymentbills) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(documents);
                var opts2 = {
                  model: 'User',
                  path: 'user'
                };
                User.populate(paymentbills, opts2, function (err, paymentbills) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.jsonp(paymentbills);
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.query.billID) {
    var billsIdArray;
    if (req.query.billsArrayLength === '1') {
      billsIdArray = [req.query.billID];
    } else {
      billsIdArray = req.query.billID;
    }
    req.db.Paymentbill.find({ bill: { $in: billsIdArray } }).sort('-created').populate('payment').populate('bill').populate('rental').populate('billrental').populate('table').exec(function(err, paymentbills) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'PaymentModeType',
          path: 'payment.paymentModeType'
        };
        req.db.Paymentbill.populate(paymentbills, opts, function (err, paymentbills) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts2 = {
              model: 'User',
              path: 'payment.paymentReceivedBy'
            };
            req.db.Paymentbill.populate(paymentbills, opts2, function (err, paymentbills) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(documents);
                var opts1 = {
                  model: 'User',
                  path: 'user'
                };
                User.populate(paymentbills, opts1, function (err, paymentbills) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(paymentbills);
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.query.billId) {
    // console.log(req.query.billId);
    req.db.Paymentbill.find({ bill: req.query.billId }).sort('-created').populate('payment').populate('bill').populate('rental').populate('billrental').populate('table').exec(function(err, paymentbills) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'PaymentModeType',
          path: 'payment.paymentModeType'
        };
        req.db.Paymentbill.populate(paymentbills, opts, function (err, paymentbills) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts2 = {
              model: 'User',
              path: 'payment.paymentReceivedBy'
            };
            req.db.Paymentbill.populate(paymentbills, opts2, function (err, paymentbills) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(documents);
                var opts1 = {
                  model: 'User',
                  path: 'user'
                };
                User.populate(paymentbills, opts1, function (err, paymentbills) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(paymentbills);
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    req.db.Paymentbill.find().sort('-created').populate('payment').populate('bill').populate('rental').populate('billrental').populate('table').exec(function(err, paymentbills) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'PaymentModeType',
          path: 'payment.paymentModeType'
        };
        req.db.PaymentBill.populate(paymentbills, opts, function (err, paymentbills) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts2 = {
              model: 'User',
              path: 'payment.paymentReceivedBy'
            };
            req.db.Paymentbill.populate(paymentbills, opts2, function (err, paymentbills) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(documents);
                var opts1 = {
                  model: 'User',
                  path: 'user'
                };
                User.populate(paymentbills, opts1, function (err, paymentbills) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.jsonp(paymentbills);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
};

/**
 * paymentBills middleware
 */
exports.paymentBillByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'package order archive is invalid'
    });
  }

  req.db.Paymentbill.findById(id).exec(function (err, paymentBill) {
    if (err) {
      return next(err);
    } else if (!paymentBill) {
      return res.status(404).send({
        message: 'No package order archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(paymentBill, opts, function (err, paymentBill) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.paymentBill = paymentBill;
          next();
        }
      });
    }
  });
};
