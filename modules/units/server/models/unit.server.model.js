'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Unit Schema
 */
var UnitSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Unit name',
    unique: true,
    trim: true
  },
  unitType: {
    type: Schema.ObjectId,
    ref: 'Unittype',
    required: 'Please provide Unit Type '
  },
  symbol: {
    type: String,
    default: '',
    required: 'Please fill Unit symbol',
    unique: true,
    trim: true
  },
  multiplierWithBaseUnit: {
    type: Number,
    default: '',
    required: 'Please fill multiplier With Base Unit',
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Unit', UnitSchema);
module.exports = function(connection) {
  return connection.model('Unit', UnitSchema);
};
