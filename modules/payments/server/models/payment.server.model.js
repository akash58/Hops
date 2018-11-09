'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * payment Schema
 */
var PaymentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  paymentModeType: {
    type: Schema.ObjectId,
    ref: 'PaymentModeType'
  },
  billedAmount: {
    type: Number,
    trim: true
  },
  paidAmount: {
    type: Number,
    trim: true
  },
  /* paymentReceivedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }, */
  description: {
    type: String
  },
  paymentReferenceNo: {
    type: Number,
    trim: true,
    unique: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Payment', PaymentSchema);

module.exports = function(connection) {
  return connection.model('Payment', PaymentSchema);
};
