'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contents Schema
 */
var TablesSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tableNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: 'Table Number Can Not Be Blank'
  },
  tableSize: {
    type: Number,
    trim: true,
    required: 'Table Size Can Not Be Blank'
  },
  currentAttendant: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  serial: {
    type: Schema.ObjectId,
    ref: 'Serial'
  },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'busy', 'finishing', 'billed', 'unavailable', 'reserved']
  },
  active: {
    type: Boolean,
    default: true
  },
  foodOnly: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Table', TablesSchema);
module.exports = function(connection) {
  return connection.model('Table', TablesSchema);
};
