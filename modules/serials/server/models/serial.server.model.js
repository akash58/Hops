'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Serials Schema
 */
var SerialSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: 'Product Number must be selected'
  },
  supplier: {
    type: Schema.ObjectId,
    ref: 'Supplier',
    required: 'Supplier Name must be selected'
  },
  serialNumber: {
    type: String,
    unique: true,
    required: 'Serial Number cannot be blank'
  },
  dateOfPurchase: {
    type: Date,
    required: 'Date of Purchase cannot be blank'
  },
  warrantyPeriod: {
    type: Number,
    default: '0',
    trim: true
  },
  dateOfWarrantyExpiry: {
    type: Date,
    default: ''
  },
  dateOfLastActivity: {
    type: Date,
    default: ''
  },
  purchasePrice: {
    type: Number,
    trim: true,
    required: 'Purchase Price cannot be blank'
  },
  depreciatedValue: {
    type: Number,
    trim: true,
    required: 'Depreciation Value cannot be blank'
  },
  residualValue: {
    type: Number,
    trim: true,
    required: 'Residual Value cannot be blank'
  },
  acquisitionType: {
    type: String,
    default: 'Purchased',
    enum: ['Purchased', 'Borrowed']
  },
  status: {
    type: String,
    default: 'Error - Undefined Status',
    enum: ['In Stock', 'Replaced', 'In Repair', 'On-rent', 'Sold', 'Junked', 'In System', 'Error - Undefined Status']
  },
  statusDetail: {
    type: String,
    // default: '',
    trim: true,
    required: 'Location In Warehouse cannot be blank'
  },
  manufacturerSerialNumber: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  system: {
    type: Schema.ObjectId,
    ref: 'System'
  },
  renting: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Serial', SerialSchema);
module.exports = function(connection) {
  return connection.model('Serial', SerialSchema);
};
