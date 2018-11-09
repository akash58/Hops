'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contents group Schema
 */
var ContentsgroupSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  contentGroupName: {
    type: String,
    trim: true,
    required: 'Content Group Name cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Contentgroup', ContentsgroupSchema);
module.exports = function(connection) {
  return connection.model('Contentgroup', ContentsgroupSchema);
};
