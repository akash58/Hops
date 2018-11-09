'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * paymentModeType Schema
 */
var PaymentModeTypeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  paymentType: {
    type: String,
    trim: true,
    unique: true,
    required: 'Payment Type cannot be blank'
  },
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('PaymentModeType', PaymentModeTypeSchema);
module.exports = function(connection) {
  return connection.model('PaymentModeType', PaymentModeTypeSchema);
};
