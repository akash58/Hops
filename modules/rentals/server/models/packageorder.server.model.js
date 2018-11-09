'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Package Order Schema
 */
var PackageOrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  },
  package: {
    type: Schema.ObjectId,
    ref: 'Package'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('PackageOrder', PackageOrderSchema);
module.exports = function(connection) {
  return connection.model('Packageorder', PackageOrderSchema);
};
