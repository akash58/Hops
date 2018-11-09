'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Component Schema
 */
var ComponentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  componentTypeName: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: 'Component Type Name cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Component', ComponentSchema);
module.exports = function(connection) {
  return connection.model('Component', ComponentSchema);
};
