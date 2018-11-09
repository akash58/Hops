'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	// Page = mongoose.model('Page'),
  _ = require('lodash');

/**
 * Create a Page
 */
exports.create = function(req, res) {

  var page = new req.db.Page(req.body);

  page.user = req.user;

  page.save(function(err) {
    if (err) {
			// console.log('Error found is : '+err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(page);
    }
  });

};

/**
 * Show the current page
 */
exports.read = function(req, res) {
  res.json(req.page);
};

/**
 * Update a page
 */
exports.update = function(req, res) {
  var page = req.page;

  page = _.extend(page, req.body);

  page.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(page);
    }
  });
};

/**
 * Delete an page
 */
exports.delete = function(req, res) {
  var page = req.page;

  page.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(page);
    }
  });
};

/**
 * List of page
 */
exports.list = function(req, res) {
  // console.log(req.session);
  if (req.db) {
    req.db.Page.find().sort('pageName').exec(function(err, pagenames) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(pagenames);
      }
    });
  } else {
    return res.status(400).send({
      message: 'No Database connected to this User!'
    });
  }
};

/**
 * page middleware
 */
exports.pageByID = function(req, res, next, id) {
  req.db.Page.findById(id).exec(function(err, page) {
    if (err) return next(err);
    if (!page) return next(new Error('Failed to load pagename ' + id));
    req.page = page;
    next();
  });
};
