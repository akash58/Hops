'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stock Audit Schema
 */
var FoodExpirySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodExpiryNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: 'Food Expiry Number Can Not Be Blank'
  },
  foodExpiryDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('FoodExpiry', FoodExpirySchema);
module.exports = function(connection) {
  return connection.model('FoodExpiry', FoodExpirySchema);
};
