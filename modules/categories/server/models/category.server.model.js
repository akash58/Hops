'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Categories Schema
 */
var CategoriesSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  categoryName: {
    type: String,
    trim: true,
    unique: true,
    required: 'Category Name Can Not Be Blank'
  },
  ratePerHourWeekday: {
    type: Number,
    trim: true,
    required: 'Weekday Rate Per Hour Can Not Be Blank'
  },
  ratePerHourWeekendHoliday: {
    type: Number,
    trim: true,
    required: 'Weekend/Holiday Rate Per Hour Can Not Be Blank'
  },
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('Category', CategoriesSchema);

module.exports = function(connection) {
  return connection.model('Category', CategoriesSchema);
  // module.exports = connection.model('User2', UserSchema);
};
