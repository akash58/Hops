'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contents Schema
 */
var ContentsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  contentgroup: {
    type: Schema.ObjectId,
    ref: 'Contentgroup'
  },
  contentName: {
    type: String,
    trim: true,
    // unique: true,
    required: 'Content Name cannot be blank'
  },
  numberOfItems: {
    type: Number,
    trim: true,
    required: 'Number Of Items cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Content', ContentsSchema);
module.exports = function(connection) {
  return connection.model('Content', ContentsSchema);
};
