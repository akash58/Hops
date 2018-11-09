'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * PackageFoodType Schema
 */
var PackageFoodTypeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  package: {
    type: Schema.ObjectId,
    ref: 'Package',
    required: 'Please Give One Of The Package'
  },
  foodtype: {
    type: Schema.ObjectId,
    ref: 'Foodtype',
    required: 'Please Select One Of The Food Type'
  },
  quantity: {
    type: Number,
    trim: true,
    required: 'Quantity cannot be blank. Please enter 1 if needed.'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('PackageFoodType', PackageFoodTypeSchema);
module.exports = function(connection) {
  return connection.model('PackageFoodType', PackageFoodTypeSchema);
};
