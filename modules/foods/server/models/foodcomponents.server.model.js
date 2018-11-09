'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contents Schema
 */
var FoodComponentsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodComponentName: {
    type: String,
    trim: true,
    unique: true,
    required: 'Food Component Name Can Not Be Blank'
  },
  baseUnit: {
    type: Schema.ObjectId,
    ref: 'Unittype',
    required: 'Base Unit must be selected'
  },
  description: {
    type: String,
    trim: true
  },
  consumable: {
    type: Boolean,
    default: false
  },
  currentStock: {
    type: Number,
    trim: true,
    default: 0
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

// mongoose.model('FoodComponent', FoodComponentsSchema);
module.exports = function(connection) {
  return connection.model('FoodComponent', FoodComponentsSchema);
};
