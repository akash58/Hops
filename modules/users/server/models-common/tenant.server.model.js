'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Client Group Schema
 */
var TenantSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tenantGroup: {
    type: Schema.ObjectId,
    ref: 'TenantGroup'
  },
  tenantName: {
    type: String,
    // default: '',
    unique: 'Tenant Name already exists',
    trim: true,
    required: 'Tenant Name cannot be blank'
  },
  date: {
    type: Date,
    default: Date.now
  },
  planDetail: {
    type: Schema.ObjectId,
    ref: 'PlanDetail'
  }
});

mongoose.model('Tenant', TenantSchema);
// module.exports = mongoose.model('Tenant', TenantSchema);
/* module.exports = function(connection) {
  return connection.model('Tenant', TenantSchema);
}; */
