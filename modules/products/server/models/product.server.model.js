'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  component: {
    type: Schema.ObjectId,
    ref: 'Component'
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  productName: {
    type: String,
    trim: true,
    default: ''
  },
  productNumber: {
    type: String,
    trim: true,
    unique: true,
    required: 'Product Number cannot be blank'
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

// mongoose.model('Product', ProductSchema);
module.exports = function(connection) {
  return connection.model('Product', ProductSchema);
};
