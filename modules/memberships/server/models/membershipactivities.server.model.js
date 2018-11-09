'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Membershipactivity Schema
 */
var MembershipactivitySchema = new Schema({
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
  dateOfBill: {
    type: Date
  },
  /* membership: {
    type: Schema.ObjectId,
    ref: 'Membership'
  }, */
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
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
  billPrice: {
    type: Number,
    trim: true,
    required: 'Bill Price for Membership cannot be blank'
  },
  // serviceTaxOnMembership: {
  //   type: Number,
  //   trim: true,
  //   required: 'Service Tax on Membership cannot be blank'
  // },
  cgstOnMembership: {
    type: Number,
    trim: true,
    required: 'CGST Tax on Membership cannot be blank'
  },
  sgstOnMembership: {
    type: Number,
    trim: true,
    required: 'SGST Tax on Membership cannot be blank'
  },
  // serviceTaxPercentage: {
  //   type: Number,
  //   trim: true,
  //   required: 'CGST Tax percentage cannot be blank'
  // },
  cgstTaxPercentage: {
    type: Number,
    trim: true,
    required: 'Service Tax percentage cannot be blank'
  },
  sgstTaxPercentage: {
    type: Number,
    trim: true,
    required: 'SGST Tax percentage cannot be blank'
  },
  membershipHsnParameter: {
    type: String,
    // default: '0',
    trim: true
  },
  membershipAmount: {
    type: Number,
    trim: true,
    required: 'Membership Fees cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Membershipactivity', MembershipactivitySchema);
module.exports = function(connection) {
  return connection.model('Membershipactivity', MembershipactivitySchema);
};
