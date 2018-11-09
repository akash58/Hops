'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Activity Schema
 */
var BillmembershipSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
  },
  membershipactivity: {
    type: Schema.ObjectId,
    ref: 'Membershipactivity'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Billmembership', BillmembershipSchema);
module.exports = function(connection) {
  return connection.model('Billmembership', BillmembershipSchema);
};
