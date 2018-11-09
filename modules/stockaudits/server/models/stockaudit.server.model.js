'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stockaudit Schema
 */
var StockauditSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  stockAuditNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: 'Stock Audit Number Can Not Be Blank'
  },
  stockAuditDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Stockaudit', StockauditSchema);

module.exports = function(connection) {
  return connection.model('Stockaudit', StockauditSchema);
};
