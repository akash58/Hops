'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
//	crypto = require('crypto');


/**
 * User Schema
 */
var PageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: [{
      type: String
    }],
    default: ['admin']
  },
  pageName: {
    type: String,
    trim: true
		// unique: true,
		// required: 'Page Name cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Page', PageSchema);
module.exports = function(connection) {
  return connection.model('Page', PageSchema);
};
