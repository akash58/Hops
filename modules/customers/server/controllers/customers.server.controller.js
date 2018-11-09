'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Customer
 */
exports.create = function(req, res) {
  var customer = new req.db.Customer(req.body);
  customer.user = req.user;

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString();

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var customer = req.customer;

  customer = _.extend(customer, req.body);

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};
exports.delete = function(req, res) {
  var customer = req.customer;

  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function(req, res) {
  if (req.query.customerName) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Customer.find({ $and: [{ active: true }, { customerName: { $regex: new RegExp('^' + req.query.customerName.toLowerCase(), 'i') } }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, customers) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(customers);
      }
    });
  } else if (req.query.customerID) {
    // console.log('called');
    // console.log(req.query.customerID);
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Customer.findOne({ customerId: Number(req.query.customerID) }).exec(function(err, customer) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(customer);
      }
    });
  } else {
    console.log('called else');
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Customer.find({ active: true }).sort('-created').populate('user', 'displayName').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, customers) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(customers);
      }
    });
  }
};

/* exports.count = function(req, res) {
  req.db.Customer.count().exec(function(err, document) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send({ count: document });
    }
  });
};*/

exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  if (req.query.customerName) {
    req.db.Customer.count({ $and: [{ active: true }, { customerName: { $regex: new RegExp('^' + req.query.customerName.toLowerCase(), 'i') } }] }).exec(function(err, customers_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d purchaseorders', customers_count);
        res.send({ count: customers_count });
      }
    });
  } else {
    req.db.Customer.count({ active: true }).exec(function(err, customers_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d purchaseorders', customers_count);
        res.send({ count: customers_count });
      }
    });
  }
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  req.db.Customer.findById(id).populate('user', 'displayName').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};
