'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Food Order Activity Schema
 */
var BillPackageOrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  /* packageOrder: {
    type: Schema.ObjectId,
    ref: 'PackageOrder'
  }, */
  /* rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  }, */
  billRental: {
    type: Schema.ObjectId,
    ref: 'Billrental'
  },
  /* package: {
    type: Schema.ObjectId,
    ref: 'Package'
  }, */
  packageName: {
    type: String,
    trim: true,
    required: 'Package Name cannot be blank.'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  quantity: {
    type: Number,
    trim: true,
    required: 'Quantity cannot be blank. Please enter 1 if needed.'
  },
  billPrice: {
    type: Number,
    trim: true,
    required: 'Bill Price cannot be blank.'
  },
  billCharge: {
    type: Number,
    trim: true,
    required: 'Bill charge cannot be blank.'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('BillPackageOrder', BillPackageOrderSchema);
module.exports = function(connection) {
  return connection.model('BillPackageOrder', BillPackageOrderSchema);
};
