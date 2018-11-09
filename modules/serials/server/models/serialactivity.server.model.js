'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Serials Schema
 */
var SerialActivitySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  serial: {
    type: Schema.ObjectId,
    ref: 'Serial'
  },
  system: {
    type: Schema.ObjectId,
    ref: 'System'
    // default: undefined
  },
  dateOfActivity: {
    type: Date,
    required: 'Date of Activity cannot be blank'
  },
  depreciatedValue: {
    type: Number,
    trim: true,
    required: 'Depreciated Value cannot be blank'
  },
  residualValue: {
    type: Number,
    trim: true,
    required: 'Residual Value cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  statusDetail: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    default: 'Error - Undefined Status',
    enum: ['In Stock', 'Replaced', 'In Repair', 'On-rent', 'Sold', 'Junked', 'In System', 'Error - Undefined Status']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Serialactivity', SerialActivitySchema);
module.exports = function(connection) {
  return connection.model('Serialactivity', SerialActivitySchema);
};
