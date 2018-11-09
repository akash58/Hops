'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Unit Schema
 */
var UnitTypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill unit type name',
    unique: true,
    trim: true
  },
  baseUnitName: {
    type: String,
    default: '',
    required: 'Please fill base unit name',
    trim: true
  },
  baseUnitSymbol: {
    type: String,
    default: '',
    required: 'Please fill base unit symbol',
    trim: true
  },
  baseUnitId: {
    type: Schema.ObjectId,
    ref: 'Unit',
    required: 'An unitType must have a baseUnitId.'
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

// mongoose.model('Unittype', UnitTypeSchema);
module.exports = function(connection) {
  return connection.model('Unittype', UnitTypeSchema);
};
