'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feedback Schema
 */
var FeedbackSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  knowabout: {
    type: String,
    trim: true,
    required: 'Please select a input!'
  },
  games: {
    type: String,
    trim: true,
    required: 'Please select a input!'
    // default: 'excellent'
    // enum:['excellent','good','average','dissatisfied']
  },
  food: {
    type: String,
    trim: true,
    required: 'Please select a input!'
    // default: 'excellent'
    // enum:['excellent','good','average','dissatisfied']
  },
  contents: {
    type: String,
    default: '',
    trim: true
  },

  DateOfCreation: {
    type: Date,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Feedback', FeedbackSchema);
module.exports = function(connection) {
  return connection.model('Feedback', FeedbackSchema);
  // module.exports = connection.model('User2', UserSchema);
};
