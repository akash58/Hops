'use strict';

/**
  * Module dependencies.
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
  * Purchase Order Schema
*/
var PurchaseOrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  purchaseOrderNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: 'Purchase Order Number Can Not Be Blank'
  },
  paymentReferenceNumber: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  supplier: {
    type: Schema.ObjectId,
    ref: 'Supplier',
    required: 'Supplier must be selected'
  },
  totalAmount: {
    type: Number,
    trim: true,
    required: 'Total Amount Can Not Be Blank'
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
// mongoose.model('Food', FoodSchema);
module.exports = function(connection) {
  return connection.model('Purchaseorder', PurchaseOrderSchema);
};
