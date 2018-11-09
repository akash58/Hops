'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Food Order Archive Schema
 */
var FoodorderarchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodOrder: {
    type: Schema.ObjectId,
    ref: 'FoodOrder'
  },
  rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  },
  rentalarchive: {
    type: Schema.ObjectId,
    ref: 'Rentalarchive'
  },
  food: {
    type: Schema.ObjectId,
    ref: 'Food'
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
  userOrignal: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdOrignal: {
    type: Date
  },
  tableId: {
    type: Schema.ObjectId,
    ref: 'Table'
  },
  status: {
    type: String,
    default: 'Error - Undefined Status',
    enum: ['Error - Undefined Status', 'Ready', 'Ready Served', 'Complete', 'Ordered', 'Preparing', 'Served']
  },
  orderTime: {
    type: Date
    // default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Foodorderarchive', FoodorderarchiveSchema);

module.exports = function(connection) {
  return connection.model('Foodorderarchive', FoodorderarchiveSchema);
};
