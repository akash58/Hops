'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var FoodComponentsInFoodSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodcomponent: {
    type: Schema.ObjectId,
    ref: 'FoodComponent',
    required: 'Food Component must be selected'
    // unique: true
  },
  quantity: {
    type: Number,
    trim: true,
    required: 'Quantity Can Not Be Blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var FoodSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodtype: {
    type: Schema.ObjectId,
    ref: 'Foodtype'
  },
  foodName: {
    type: String,
    trim: true,
    unique: true,
    required: 'Food Name cannot be blank'
  },
  price: {
    type: Number,
    trim: true,
    required: 'Price cannot be blank'
  },
  active: {
    type: Boolean,
    default: true
  },
  foodComponentsInFood: {
    type: [FoodComponentsInFoodSchema],
    default: []
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Food', FoodSchema);
module.exports = function(connection) {
  return connection.model('Food', FoodSchema);
};
