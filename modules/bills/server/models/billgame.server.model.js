'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Activity Schema
 */
var BillGameSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  /* rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  }, */
  billRental: {
    type: Schema.ObjectId,
    ref: 'Billrental'
  },
  /* customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  }, */
  categoryName: {
    type: String,
    trim: true,
    required: 'Category Name cannot be blank.'
  },
  noOfMilisecond: {
    type: Number,
    trim: true,
    required: 'No Of Milisecond cannot be blank. Please enter 1 if needed.'
  },
  timePlayed: {
    type: String,
    trim: true,
    required: 'Time Played cannot be blank.'
  },
  hoursCharged: {
    type: Number,
    trim: true,
    required: 'Hours Charged cannot be blank.'
  },
  ratePerHourCharged: {
    type: Number,
    trim: true,
    required: 'Rate PerHour Charged cannot be blank.'
  },
  amountCharged: {
    type: Number,
    trim: true,
    required: 'Amount Charged cannot be blank.'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('BillGame', BillGameSchema);
module.exports = function(connection) {
  return connection.model('BillGame', BillGameSchema);
};
