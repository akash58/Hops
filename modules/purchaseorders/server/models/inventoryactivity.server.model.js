'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Inventory Activity Schema
 */
var InventoryActivitySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  startingStock: {
    type: Number,
    trim: true,
    required: 'Starting Stock Can Not Be Blank'
  },
  addedOrRemovedStock: {
    type: Number,
    trim: true,
    required: 'Added Or Removed Stock Can Not Be Blank'
  },
  endingStock: {
    type: Number,
    trim: true,
    required: 'Ending Stock Can Not Be Blank'
  },
  foodcomponent: {
    type: Schema.ObjectId,
    ref: 'FoodComponent',
    required: 'Food Component must be selected'
  },
  activityType: {
    type: String,
    trim: true,
    required: 'Activity Type Can Not Be Blank',
    enum: ['Purchase Order', 'Food Order', 'Food Expiry', 'Stock Audit Correction']
  },
  purchaseOrder: {
    type: Schema.ObjectId,
    ref: 'Purchaseorder'
    // required: 'Purchase Order must be selected'
  },
  foodOrder: {
    type: Schema.ObjectId,
    ref: 'FoodOrder'
    //  required: 'Food Order must be selected'
  },
  foodExpiry: {
    type: Schema.ObjectId,
    ref: 'FoodExpiry'
    //  required: 'Food Expiry Record must be selected'
  },
  stockAudit: {
    type: Schema.ObjectId,
    ref: 'Stockaudit'
    //  required: 'Stock Audit must be selected'
  },
  previousInventoryActivity: {
    type: Schema.ObjectId,
    ref: 'InventoryActivity'
    //  required: 'Inventory Activity must be selected'
  },
  price: {
    type: Number,
    trim: true
    //  required : 'Price Can Not Be Blank'
  },
  unitUsedForPrice: {
    type: Schema.ObjectId,
    ref: 'Unit'
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

// mongoose.model('InventoryActivity', InventoryActivitySchema);

module.exports = function(connection) {
  return connection.model('InventoryActivity', InventoryActivitySchema);
};
