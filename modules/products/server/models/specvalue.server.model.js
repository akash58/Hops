'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var SpecValueSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  specdesc: {
    type: Schema.ObjectId,
    ref: 'Specdesc'
  },
  specificationValue: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Specvalue', SpecValueSchema);
module.exports = function(connection) {
  return connection.model('Specvalue', SpecValueSchema);
};
