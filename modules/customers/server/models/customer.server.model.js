'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  contactName: {
    type: String
    // ref: 'Component'
    // required: 'Contact Name cannot be blank'
  },
  customerName: {
    type: String,
    // default: '',
    trim: true,
    unique: true,
    required: 'Customer Name cannot be blank'
  },
  address: {
    type: String,
    default: '',
    trim: true,
    // unique: true,
    required: 'Address cannot be blank'
  },
  customerId: {
    type: String,
    unique: true,
    required: 'Customer ID cannot be blank Please Scan Customer Barcode'
  },
  designation: {
    type: String
    // default: '',
    // trim: true
    // required: 'Designation cannot be blank'
  },
  telephone: {
    type: Number
    // default: '',
    // trim: true
    // unique: true,
    // required: 'Telephone cannot be blank'
  },
  mobile: {
    type: Number,
    default: '',
    trim: true,
    required: 'Mobile cannot be blank',
    match: [/^\d{10}$/, 'Please enter only Number']
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email cannot be blank',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  promotion: {
    type: Boolean,
    default: false
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

// mongoose.model('Customer', CustomerSchema);
module.exports = function(connection) {
  return connection.model('Customer', CustomerSchema);
  // module.exports = connection.model('User2', UserSchema);
};

