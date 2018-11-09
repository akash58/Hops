'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // InventoryActivity = mongoose.model('InventoryActivity'),
  _ = require('lodash');

/**
 * Create a document
 */
exports.create = function(req, res) {
	// console.log(req.body);

  var document = new req.db.Inventoryactivity(req.body);

  document.user = req.user;

  // console.log(document);

  document.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(document);
    }
  });
};

/**
 * Show the current Document
 */
exports.read = function(req, res) {
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
exports.update = function(req, res) {

  var document = req.document;

  document = _.extend(document, req.body);

  document.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(document);
    }
  });
};

/**
 * Delete an Document
 */
exports.delete = function(req, res) {
  var document = req.document;

  document.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(document);
    }
  });
};

/**
 * List of Document
 */
exports.list = function(req, res) {
  req.db.Inventoryactivity.find().sort('-created').populate('user').exec(function(err, documents) {
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
};

/**
 * Document middleware
 */
exports.inventoryActivityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Inventory activity is invalid'
    });
  }

  req.db.Inventoryactivity.findById(id).exec(function (err, document) {
    if (err) {
      return next(err);
    } else if (!document) {
      return res.status(404).send({
        message: 'No Inventory activitye with that identifier has been found'
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
