'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Stockaudit = mongoose.model('Stockaudit'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Stockaudit
 */
exports.createStockAudit = function(req, res) {
  var stockaudit = new req.db.Stockaudit(req.body);
  stockaudit.user = req.user;

  stockaudit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockaudit);
    }
  });
};

/**
 * Show the current Stockaudit
 */
exports.readStockAudit = function(req, res) {
  // convert mongoose document to JSON
  var stockaudit = req.stockaudit ? req.stockaudit.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  stockaudit.isCurrentUserOwner = req.user && stockaudit.user && stockaudit.user._id.toString() === req.user._id.toString();

  res.jsonp(stockaudit);
};

/**
 * Update a Stockaudit
 */
/* exports.update = function(req, res) {
  var stockaudit = req.stockaudit;

  stockaudit = _.extend(stockaudit, req.body);

  stockaudit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockaudit);
    }
  });
}; */

/**
 * Delete an Stockaudit
 */
/* exports.delete = function(req, res) {
  var stockaudit = req.stockaudit;

  stockaudit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockaudit);
    }
  });
}; */

/**
 * List of Stockaudits
 */
exports.listStockAudits = function(req, res) {
  if (req.query.searchText) {
  // console.log(req.query.searchText);
    req.db.Stockaudit.find({ stockAuditNumber: req.query.searchText }).sort('-created').skip((req.query.page - 1) * 10).limit(10).exec(function(err, stockaudits) {
      if (err) {
        //  console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = {
          model: 'User',
          path: 'user'
        };
        User.populate(stockaudits, opts, function (err, stockaudits) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(stockaudits);
          }
        });
      }
    });
  } else {
    req.db.Stockaudit.find().sort('-created').skip((req.query.page - 1) * 10).limit(10).exec(function(err, stockaudits) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(stockaudits, opts1, function (err, stockaudits) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(stockaudits);
          }
        });
      }
    });
  }
};


/**
 * Count of stockaudits
 */
exports.count = function(req, res) {
	// console.log(req.query);
	// console.log(req.query.searchText);
  if (req.query.searchText) {
    req.db.Stockaudit.count({ stockAuditNumber: req.query.searchText }).exec(function(err, stockaudits_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('there are %d stockaudits', stockaudits_count);
        res.send({ count: stockaudits_count });
      }
    });
  } else {
    req.db.Stockaudit.count().exec(function(err, stockaudits_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d stockaudits', stockaudits_count);
        res.send({ count: stockaudits_count });
      }
    });
  }
};

/**
 * Stockaudit middleware
 */
exports.stockauditByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Stockaudit is invalid'
    });
  }

  req.db.Stockaudit.findById(id).exec(function (err, stockaudit) {
    if (err) {
      return next(err);
    } else if (!stockaudit) {
      return res.status(404).send({
        message: 'No Stockaudit with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(stockaudit, opts, function (err, stockaudit) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.stockaudit = stockaudit;
          next();
        }
      });
    }
  });
};
