'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Food Order Activity Schema
 */
var BillfoodorderarchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  billFoodOrder: {
    type: Schema.ObjectId,
    ref: 'BillFoodOrder'
  },
  billrental: {
    type: Schema.ObjectId,
    ref: 'Billrental'
  },
  billRentalArchive: {
    type: Schema.ObjectId,
    ref: 'Billrentalarchive'
  },
  /* food: {
    type: Schema.ObjectId,
    ref: 'Food'
  }, */
  foodName: {
    type: String,
    trim: true,
    required: 'Food Name cannot be blank.'
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
  quantityCharged: {
    type: Number,
    trim: true,
    required: 'Quantity Charged cannot be blank.'
  },
  billPrice: {
    type: Number,
    trim: true,
    required: 'Bill Price cannot be blank.'
  },
  billCharge: {
    type: Number,
    trim: true,
    required: 'Bill charge cannot be blank.'
  },
  userOrignal: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdOrignal: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Billfoodorderarchive', BillfoodorderarchiveSchema);

module.exports = function(connection) {
  return connection.model('Billfoodorderarchive', BillfoodorderarchiveSchema);
};
