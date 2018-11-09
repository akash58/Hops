'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * packagee Schema
 */
var PackageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  packageName: {
    type: String,
    trim: true,
    unique: true,
    required: 'Package Name cannot be blank'
  },
  packagePrice: {
    type: Number,
    trim: true,
    required: 'Price cannot be blank'
  },
  active: {
    type: Boolean,
    default: true
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  hours: {
    type: String,
    trim: true,
    required: 'Number of Hours included in Package cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Package', PackageSchema);
module.exports = function(connection) {
  return connection.model('Package', PackageSchema);
};
