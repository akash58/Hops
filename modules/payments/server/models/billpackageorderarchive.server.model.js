'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Food Order Archive Schema
 */
var BillpackageorderarchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  billPackageorder: {
    type: Schema.ObjectId,
    ref: 'BillPackageOrder'
  },
  billrental: {
    type: Schema.ObjectId,
    ref: 'Billrental'
  },
  billRentalArchive: {
    type: Schema.ObjectId,
    ref: 'Billrentalarchive'
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

// mongoose.model('Billpackageorderarchive', BillpackageorderarchiveSchema);

module.exports = function(connection) {
  return connection.model('Billpackageorderarchive', BillpackageorderarchiveSchema);
};
