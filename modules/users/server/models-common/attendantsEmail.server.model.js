'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attendant Schema
 */
var AttendantSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  /* username: {
    type: String,
    lowercase: true,
    required: 'username is require'
  },*/
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
    required: 'Please fill a valid email address'
  },
  active: {
    type: Boolean,
    default: true
  },
  tenants: [{
    type: Schema.ObjectId
  }],
  tenantGroup: {
    type: Schema.ObjectId
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }/* ,
   user: {
    type: Schema.ObjectId,
    ref: 'User'
  }*/
});

mongoose.model('TempAttendantTokenWithEmail', AttendantSchema);
/* module.exports = function(connection) {
  return connection.model('TempAttendantTokenWithEmail', AttendantSchema);
}; */
// module.exports = mongoose.model('TempAttendantTokenWithEmail', AttendantSchema);
