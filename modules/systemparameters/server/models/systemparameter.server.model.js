'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Systemparameter Schema
 */
var SystemparameterSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  systemParameterName: {
    type: String,
    trim: true,
    unique: true,
    required: 'System Parameter Name cannot be blank'
  },
  defaultValue: {
    type: String,
    trim: true,
    required: 'Default Value cannot be blank'
  },
  value: {
    type: String,
    default: '',
    trim: true,
    required: 'Value cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'Description cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Systemparameter', SystemparameterSchema);
module.exports = function(connection) {
  return connection.model('Systemparameter', SystemparameterSchema);
  // module.exports = connection.model('User2', UserSchema);
};
