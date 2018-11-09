'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Food Order Activity Schema
 */
var BillFoodOrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  // foodOrder: {
    // type: Schema.ObjectId,
    // ref: 'FoodOrder'
  // },
  /* rental: {
    type: Schema.ObjectId,
    ref: 'Rental'
  }, */
  billRental: {
    type: Schema.ObjectId,
    ref: 'Billrental'
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('BillFoodOrder', BillFoodOrderSchema);
module.exports = function(connection) {
  return connection.model('BillFoodOrder', BillFoodOrderSchema);
};
