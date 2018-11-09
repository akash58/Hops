'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var FoodTypeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodTypeName: {
    type: String,
    trim: true,
    unique: true,
    required: 'Food Type Name cannot be blank'
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

// mongoose.model('FoodType', FoodTypeSchema);
module.exports = function(connection) {
  return connection.model('Foodtype', FoodTypeSchema);
};
