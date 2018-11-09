'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Package Order Archive Schema
 */
var PackageorderarchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  packageOrder: {
    type: Schema.ObjectId,
    ref: 'Purchaseorder'
  },
  rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  },
  rentalarchive: {
    type: Schema.ObjectId,
    ref: 'Rentalarchive'
  },
  package: {
    type: Schema.ObjectId,
    ref: 'Package'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  userOrignal: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdOrignal: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Packageorderarchive', PackageorderarchiveSchema);

module.exports = function(connection) {
  return connection.model('Packageorderarchive', PackageorderarchiveSchema);
};
