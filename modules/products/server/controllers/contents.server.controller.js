'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Content = mongoose.model('Content'),
  // Contentgroup = mongoose.model('Contentgroup'),
  _ = require('lodash');

/**
 * Create a content
 */
exports.create = function(req, res) {

  var content = new req.db.Content({
    contentgroup: req.body.contentgroup,
    contentName: req.body.contentName,
    numberOfItems: req.body.numberOfItems
  });

  content.user = req.user;
  content.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(content);
    }
  });
};
/**
 * Show the current content
 */
exports.read = function(req, res) {
  res.json(req.content);
};

/**
 * Update a content
 */
exports.update = function(req, res) {

  var content = req.content;

  content = _.extend(content, req.body);

  content.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(content);
    }
  });
};

/**
 * Delete an content
 */
exports.delete = function(req, res) {
  var content = req.content;
  content.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(content);
    }
  });
};

/**
 * List of content
 */
exports.list = function(req, res) {
  req.db.Content.find().sort('created').exec(function(err, contents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(contents, opts1, function (err, contents) {
        if (err) {
          // console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(contents);
        }
      });
    }
  });
};

/**
 * Content middleware
 */
exports.contentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'content is invalid'
    });
  }

  req.db.Content.findById(id).exec(function (err, content) {
    if (err) {
      return next(err);
    } else if (!content) {
      return res.status(404).send({
        message: 'No content with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(content, opts, function (err, content) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.content = content;
          next();
        }
      });
    }
  });
};
