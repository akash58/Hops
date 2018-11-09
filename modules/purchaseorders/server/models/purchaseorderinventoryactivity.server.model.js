'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Purchase Order Inventory Activity Schema
 */
var PurchaseOrderInventoryActivitySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  purchaseOrder: {
    type: Schema.ObjectId,
    ref: 'Purchaseorder',
    required: 'Purchase Order must be selected'
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

// mongoose.model('PurchaseOrderInventoryActivity', PurchaseOrderInventoryActivitySchema);

module.exports = function(connection) {
  return connection.model('PurchaseOrderInventoryActivity', PurchaseOrderInventoryActivitySchema);
};
