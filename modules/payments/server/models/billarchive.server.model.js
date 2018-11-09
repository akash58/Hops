'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bill Archive Schema
 */
var BillarchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
  },
  billNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: 'Bill Number must be enter'
  },
  table: {
    type: Schema.ObjectId,
    ref: 'Table'
    // required: 'Serial Number must be selected'
  },
  dateOfBill: {
    type: Date
    // required: 'Rental Start Time cannot be blank'
  },
  extraCharge: {
    type: Number,
    default: '0',
    trim: true
    // required: 'Rental End Time cannot be blank'
  },
  extraChargeDescription: {
    type: String,
    default: '',
    trim: true
  },
  descriptionForBill: {
    type: String,
    default: '',
    trim: true
  },
  billTotal: {
    type: Number,
    default: '0',
    trim: true
  },
  status: {
    type: String,
    default: '',
    trim: true
  },
  serviceChargeRate: {
    type: Number,
    default: '0',
    trim: true
  },
  cgstRateForFood: {
    type: Number,
    default: '0',
    trim: true
  },
  sgstRateForFood: {
    type: Number,
    default: '0',
    trim: true
  },
  foodHsnParameter: {
    type: String,
    // default: '0',
    trim: true
  },
  cgstRateForGame: {
    type: Number,
    default: '0',
    trim: true
  },
  sgstRateForGame: {
    type: Number,
    default: '0',
    trim: true
  },
  gameHsnParameter: {
    type: String,
    // default: '0',
    trim: true
  },
  cgstRateForPackage: {
    type: Number,
    default: '0',
    trim: true
  },
  sgstRateForPackage: {
    type: Number,
    default: '0',
    trim: true
  },
  packageHsnParameter: {
    type: String,
    // default: '0',
    trim: true
  },
  cgstRateForMembership: {
    type: Number,
    default: '0',
    trim: true
  },
  sgstRateForMembership: {
    type: Number,
    default: '0',
    trim: true
  },
  membershipHsnParameter: {
    type: String,
    // default: '0',
    trim: true
  },
  rounding: {
    type: Number,
    default: '0',
    trim: true
  },
  discountInpercent: {
    type: Number,
    default: '0',
    trim: true
  },
  discountInValue: {
    type: Number,
    default: '0',
    trim: true
  },
  discountDescription: {
    type: String,
    default: '',
    trim: true
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

// mongoose.model('Billarchive', BillarchiveSchema);


module.exports = function(connection) {
  return connection.model('Billarchive', BillarchiveSchema);
};
