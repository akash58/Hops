'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bill membership archive Schema
 */
var BillmembershiparchiveSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
  },
  billArchive: {
    type: Schema.ObjectId,
    ref: 'Billarchive'
    // required: 'Serial Number must be selected'
  },
  billmembership: {
    type: Schema.ObjectId,
    ref: 'Billmembership'
  },
  membershipactivity: {
    type: Schema.ObjectId,
    ref: 'Membershipactivity'
  },
  userOrignal: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdOrignal: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Billmembershiparchive', BillmembershiparchiveSchema);

module.exports = function(connection) {
  return connection.model('Billmembershiparchive', BillmembershiparchiveSchema);
};
