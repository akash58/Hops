'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var FoodOrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
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
  table: {
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

// mongoose.model('Article', ArticleSchema);
module.exports = function(connection) {
  return connection.model('FoodOrder', FoodOrderSchema);
};
