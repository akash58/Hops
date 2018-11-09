'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Specification Description Schema
 */
var SpecDescSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  component: {
    type: Schema.ObjectId,
    ref: 'Component'
  },
  specificationDescription: {
    type: String,
    default: '',
    trim: true,
    required: 'Specification Description cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Specdesc', SpecDescSchema);
module.exports = function(connection) {
  return connection.model('Specdesc', SpecDescSchema);
};
