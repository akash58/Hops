'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stock Audit Inventory Activity Schema
 */
var FoodExpiryInventoryActivitySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  foodExpiry: {
    type: Schema.ObjectId,
    ref: 'FoodExpiry',
    required: 'Food Expiry must be selected'
  },
  inventoryActivity: {
    type: Schema.ObjectId,
    ref: 'InventoryActivity',
    required: 'Inventory Activity must be selected'
  },
  /* price : {
    type: Number,
    trim: true,
    required : 'Price Can Not Be Blank'
  }, */
  /* description: {
    type : String,
    trim : true
  }, */
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('FoodExpiryInventoryActivity', FoodExpiryInventoryActivitySchema);
module.exports = function(connection) {
  return connection.model('FoodExpiryInventoryActivity', FoodExpiryInventoryActivitySchema);
};
