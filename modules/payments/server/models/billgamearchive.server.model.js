'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Activity Schema
 */
var BillgamearchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  billGame: {
    type: Schema.ObjectId,
    ref: 'BillGame'
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  billRental: {
    type: Schema.ObjectId,
    ref: 'Billrentalarchive'
  },
  billRentalArchive: {
    type: Schema.ObjectId,
    ref: 'Billrentalarchive'
  },
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

// mongoose.model('Billgamearchive', BillgamearchiveSchema);

module.exports = function(connection) {
  return connection.model('Billgamearchive', BillgamearchiveSchema);
};
