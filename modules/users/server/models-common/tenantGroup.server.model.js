'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Client Group Schema
*/
var TenantGroupSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tenantGroupName: {
    type: String,
    // default: '',
    unique: 'Tenant Name already exists',
    trim: true,
    required: 'Tenant Name cannot be blank'
  },
  tenants: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Tenant'
    }],
    default: []
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

mongoose.model('TenantGroup', TenantGroupSchema);
// module.exports = mongoose.model('TenantGroup', TenantGroupSchema);
/* module.exports = function(connection) {
  return connection.model('Tenant', TenantSchema);
}; */
