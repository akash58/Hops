'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Supplier Schema
 */
var SupplierSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  contactName: {
    type: String,
    // ref: 'Component'
    required: 'Contact Name cannot be blank'
  },
  companyName: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: 'Company Name cannot be blank'
  },
  address: {
    type: String,
    default: '',
    trim: true,
    // unique: true,
    required: 'Address cannot be blank'
  },
  designation: {
    type: String,
    default: '',
    trim: true,
    required: 'Designation cannot be blank'
  },
  telephone: {
    type: Number,
    default: '',
    trim: true,
    unique: true,
    required: 'Telephone cannot be blank'
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
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Supplier', SupplierSchema);
module.exports = function(connection) {
  return connection.model('Supplier', SupplierSchema);
  // module.exports = connection.model('User2', UserSchema);
};
