'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * increment parameter Schema
 */
var IncrementParameterSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    trim: true
  },
  value: {
    type: Number,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('IncrementParameter', IncrementParameterSchema);

module.exports = function(connection) {
  return connection.model('IncrementParameter', IncrementParameterSchema);
};
