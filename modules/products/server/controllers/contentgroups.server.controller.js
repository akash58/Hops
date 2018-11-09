'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Contentgroup = mongoose.model('Contentgroup'),
  _ = require('lodash');

/**
 * Create a contentGroup
 */
exports.create = function(req, res) {
  var contentgroup = new req.db.Contentgroup({
    product: req.body.product,
    contentGroupName: req.body.contentGroupName
  });

  contentgroup.user = req.user;

  contentgroup.save(function(err) {
    if (err) {

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contentgroup);
    }
  });
};

exports.returnActiveContentgroup = function(req, res, next) {
  next();
};

/**
 * Show the current contentGroup
 */
exports.read = function(req, res) {
  res.json(req.contentgroup);
};

/**
 * Update a contentGroup
 */
exports.update = function(req, res) {
  var contentgroup = req.contentgroup;

  contentgroup = _.extend(contentgroup, req.body);

  contentgroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contentgroup);
    }
  });
};

/**
 * Delete an contentGroup
 */
exports.delete = function(req, res) {
  var contentgroup = req.contentgroup;

  contentgroup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contentgroup);
    }
  });
};

/**
 * List of contentGroup
 */
exports.list = function(req, res) {
  req.db.Contentgroup.find().sort('-created').populate('products').exec(function(err, contentgroups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(contentgroups, opts1, function (err, contentgroups) {
        if (err) {
          // console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(contentgroups);
        }
      });
    }
  });
};

/**
 * ContentGroups middleware
 */
exports.contentgroupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'contentgroup is invalid'
    });
  }

  req.db.Contentgroup.findById(id).exec(function (err, contentgroup) {
    if (err) {
      return next(err);
    } else if (!contentgroup) {
      return res.status(404).send({
        message: 'No contentgroup with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(contentgroup, opts, function (err, contentgroup) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.contentgroup = contentgroup;
          next();
        }
      });
    }
  });
};
