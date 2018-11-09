'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  // Billgamearchive = mongoose.model('Billgamearchive'),
  _ = require('lodash');

/**
 * Create a Bill game Archive
 */
exports.create = function(req, res) {
  // console.log(req.body);

  var billgamearchive = new req.db.Billgamearchive(req.body);

  billgamearchive.user = req.user;

  // console.log(billgamearchive);

  billgamearchive.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(billgamearchive);
    }
  });
};

/**
 * Show the current BillGamearchive
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billgamearchive = req.billgamearchive ? req.billgamearchive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  billgamearchive.isCurrentUserOwner = req.user && billgamearchive.user && billgamearchive.user._id.toString() === req.user._id.toString();

  res.jsonp(billgamearchive);
};

/**
 * Update a billgamearchive
 */
/* exports.update = function(req, res) {

  var billgamearchive = req.billgamearchive;

  billgamearchive = _.extend(billgamearchive, req.body);

  billgamearchive.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billgamearchive);
    }
  });
}; */

/**
 * Delete an billgamearchive
 */
/* exports.delete = function(req, res) {
  var billgamearchive = req.billgamearchive;

  billgamearchive.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billgamearchive);
    }
  });
}; */

/**
 * List of billgamearchive
 */
exports.list = function(req, res) {
  if (req.query.billRentalArchive) {
    req.db.Billgamearchive.find({ billRentalArchive: req.query.billRentalArchive }).sort('-created').exec(function(err, billgamearchives) {
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
        User.populate(billgamearchives, opts, function (err, billgamearchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(billgamearchives);
          }
        });
      }
    });
  } else {
    req.db.Billgamearchive.find().sort('-created').exec(function(err, billgamearchives) {
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
        User.populate(billgamearchives, opts1, function (err, billgamearchives) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(billgamearchives);
          }
        });
      }
    });
  }

};

/**
 * billgamearchive middleware
 */
exports.billgamearchiveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill game archive is invalid'
    });
  }

  req.db.Billgamearchive.findById(id).exec(function (err, billgamearchive) {
    if (err) {
      return next(err);
    } else if (!billgamearchive) {
      return res.status(404).send({
        message: 'No bill game archive with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billgamearchive, opts, function (err, billgamearchive) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billgamearchive = billgamearchive;
          next();
        }
      });
    }
  });
};
