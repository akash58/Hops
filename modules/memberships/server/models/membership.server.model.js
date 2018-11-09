'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Membership Schema
 */
var MembershipSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  billNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: 'Bill Number must be entered'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
    unique: true,
    required: 'Customer Name must be selected'
  },
  membershipStartDate: {
    type: Date,
    required: 'Date of Membership cannot be blank'
  },
  membershipExpiry: {
    type: Date,
    default: ''
  },
  membershipPeriod: {
    type: Number,
    default: '0',
    trim: true
  },
  membershipAmount: {
    type: Number,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
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

// mongoose.model('Membership', MembershipSchema);
module.exports = function(connection) {
  return connection.model('Membership', MembershipSchema);
};
