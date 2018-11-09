'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Role Schema
 */
var RoleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  roleName: {
    type: String,
    trim: true,
    // unique: true,
    required: 'Role Name Cannot Be Blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Role', RoleSchema);
module.exports = function(connection) {
  return connection.model('Role', RoleSchema);
};
