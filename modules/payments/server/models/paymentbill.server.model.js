'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * payment Bill Schema
 */
var PaymentBillSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  payment: {
    type: Schema.ObjectId,
    ref: 'Payment'
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
  },
  billNumber: {
    type: Number,
    trim: true,
    required: 'Bill Number must be enter'
  },
  billCleared: {
    type: Boolean,
    default: true
  },
  paymentTowardBill: {
    type: Number,
    trim: true
  },
  billTotal: {
    type: Number,
    trim: true
  },
  remainingAmount: {
    type: Number,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('PaymentBill', PaymentBillSchema);

module.exports = function(connection) {
  return connection.model('PaymentBill', PaymentBillSchema);
};
