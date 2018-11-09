'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var RentalSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  table: {
    type: Schema.ObjectId,
    ref: 'Table',
    required: 'Table Number must be selected'
  },
  serial: {
    type: Schema.ObjectId,
    ref: 'Serial'
    // required: 'Serial Number must be selected'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
    required: 'Customer Name must be selected'
  },
  attendant: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'Attendant Name must be selected'
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
  /* extraCharge : {
    type: Number,
    default: '0',
    trim: true
  }, */
  extraChargeDescription: {
    type: String,
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Article', ArticleSchema);
module.exports = function(connection) {
  return connection.model('Rental', RentalSchema);
};
