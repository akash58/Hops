'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rental Order Archive Schema
 */
var RentalarchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  },
  table: {
    type: Schema.ObjectId,
    ref: 'Table'
  },
  serial: {
    type: Schema.ObjectId,
    ref: 'Serial'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  attendant: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  rentalPeriod: {
    type: Number,
    default: '0',
    trim: true
  },
  rentalStart: {
    type: Date
    // required: 'Rental Start Time cannot be blank'
  },
  rentalEnd: {
    type: Date
    // required: 'Rental End Time cannot be blank'
  },
  deposit: {
    type: Number,
    default: '0',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  activeRental: {
    type: Boolean,
    default: true
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
    // required: 'Bill Number must be selected'
  },
  billArchive: {
    type: Schema.ObjectId,
    ref: 'Billarchive'
  },
  renewalRental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  },
  renewalRentalStart: {
    type: Date
  },
  expectedRevenue: {
    type: Number,
    default: 0,
    trim: true
  },
  foodOnly: {
    type: Boolean,
    default: true
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

// mongoose.model('Rentalarchive', RentalarchiveSchema);

module.exports = function(connection) {
  return connection.model('Rentalarchive', RentalarchiveSchema);
};
