'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  // Billarchive = mongoose.model('Billarchive'),
  _ = require('lodash');

/**
 * Create a Bill Archive
 */
exports.create = function(req, res) {

  // console.log('req.body : ');
  // console.log(req.body);

  var billarchive = new req.db.Billarchive(req.body);

  billarchive.user = req.user;

  // console.log('billarchive : ');
  // console.log(billarchive);

  billarchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(billarchive);
    }
  });
};

/**
 * Show the current Billarchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billarchive = req.billarchive ? req.billarchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  billarchive.isCurrentUserOwner = req.user && billarchive.user && billarchive.user._id.toString() === req.user._id.toString();

  res.jsonp(billarchive);
};

/**
 * Update a Billarchive
 */
/* exports.update = function(req, res) {

  var billarchive = req.billarchive;

  billarchive = _.extend(billarchive, req.body);

  billarchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billarchive);
    }
  });
}; */

/**
 * Delete an billarchive
 */
exports.delete = function(req, res) {
  var billarchive = req.billarchive;

  billarchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(billarchive);
    }
  });
};

/**
 * List of billarchive
 */
exports.list = function(req, res) {
  req.query.limit = Number(req.query.limit) || 10;
  req.query.page = Number(req.query.page) || 1;
  // console.log(req.query.date);
  if (req.query.date) {
    req.db.Billarchive.find({ dateOfBill: req.query.date }).sort('-created').populate('table').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, billarchives) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(documents);
        var opts = {
          model: 'User',
          path: 'user'
        };
        User.populate(billarchives, opts, function (err, billarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opt = {
              model: 'User',
              path: 'userOrignal'
            };
            User.populate(billarchives, opt, function(err, billarchives) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(billarchives);
                res.jsonp(billarchives);
              }
            });
          }
        });
      }
    });
  } else if (req.query.billNumber) {
    req.db.Billarchive.find({ billNumber: req.query.billNumber }).sort('-created').populate('table').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, billarchives) {
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
        User.populate(billarchives, opts1, function (err, billarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opt2 = {
              model: 'User',
              path: 'userOrignal'
            };
            User.populate(billarchives, opt2, function(err, billarchives) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(billarchives);
              }
            });
          }
        });
      }
    });
  } else {
    req.db.Billarchive.find().sort('-created').populate('table').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, billarchives) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(documents);
        var opts3 = {
          model: 'User',
          path: 'user'
        };
        User.populate(billarchives, opts3, function(err, billarchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opt3 = {
              model: 'User',
              path: 'userOrignal'
            };
            User.populate(billarchives, opt3, function(err, billarchives) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(billarchives);
              }
            });
          }
        });
      }
    });
  }

};

exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  if (req.query.billNumber) {
    req.db.Billarchive.count({ billNumber: req.query.billNumber }).exec(function(err, billarchives_count) {
      if (err) {
      // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d serials', serials_count);
        res.send({ count: billarchives_count });
      }
    });
  } else if (req.query.date) {
    req.db.Billarchive.count({ dateOfBill: req.query.date }).exec(function(err, billarchives_count) {
      if (err) {
      // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d serials', serials_count);
        res.send({ count: billarchives_count });
      }
    });
  } else {
    req.db.Billarchive.count().exec(function(err, billarchives_count) {
      if (err) {
      // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d serials', serials_count);
        res.send({ count: billarchives_count });
      }
    });
  }
};

/**
 * billarchive middleware
 */
exports.billarchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill archive is invalid'
    });
  }

  req.db.Billarchive.findById(id).exec(function (err, billarchive) {
    if (err) {
      return next(err);
    } else if (!billarchive) {
      return res.status(404).send({
        message: 'No bill archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billarchive, opts, function (err, billarchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billarchive = billarchive;
          next();
        }
      });
    }
  });
};
