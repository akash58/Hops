'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Systems Schema
 */
var BillrentalSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
    // required: 'Serial Number must be selected'
  },
  rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
    // required: 'Serial Number must be selected'
  },
  deposit: {
    type: Number,
    default: 0,
    trim: true
  },
  serviceChargeOnFood: {
    type: Number,
    default: 0,
    trim: true
  },
  cgstOnFood: {
    type: Number,
    default: 0,
    trim: true
  },
  sgstOnFood: {
    type: Number,
    default: 0,
    trim: true
  },
  cgstOnGame: {
    type: Number,
    default: 0,
    trim: true
  },
  sgstOnGame: {
    type: Number,
    default: 0,
    trim: true
  },
  cgstOnPackage: {
    type: Number,
    default: 0,
    trim: true
  },
  sgstOnPackage: {
    type: Number,
    default: 0,
    trim: true
  },
  serviceChargeOnGame: {
    type: Number,
    default: 0,
    trim: true
  },
  serviceChargeForPackage: {
    type: Number,
    default: 0,
    trim: true
  },
  foodRevenue: {
    type: Number,
    default: 0,
    trim: true
  },
  gameRevenue: {
    type: Number,
    default: 0,
    trim: true
  },
  packageRevenue: {
    type: Number,
    default: 0,
    trim: true
  },
  totalOnGame: {
    type: Number,
    default: 0,
    trim: true
  },
  totalOnFood: {
    type: Number,
    default: 0,
    trim: true
  },
  totalOnPackage: {
    type: Number,
    default: 0,
    trim: true
  },
  subTotalAmountForCustomer: {
    type: Number,
    default: 0,
    trim: true
  },
  totalAmountForCustomer: {
    type: Number,
    default: 0,
    trim: true
  },
  isMember: {
    type: Boolean,
    trim: true
  },
  membershipDiscountPercentage: {
    type: Number,
    default: 0,
    trim: true
  },
  membershipDiscountOnFood: {
    type: Number,
    default: 0,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Billrental', BillrentalSchema);
module.exports = function(connection) {
  return connection.model('Billrental', BillrentalSchema);
};
