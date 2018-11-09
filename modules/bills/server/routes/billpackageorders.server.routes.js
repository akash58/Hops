'use strict';

/**
 * Module dependencies
 */
// var rentalsPolicy = require('../policies/rental.server.policy'),
var billpackageorders = require('../controllers/billpackageorders.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/billpackageorders') // .all(rentalsPolicy.isAllowed)
    .get(billpackageorders.list)
    .post(billpackageorders.create);

  // Single article routes
  app.route('/api/billpackageorders/:billpackageorderId')// .all(rentalsPolicy.isAllowed)
    .get(billpackageorders.read)
    // .put(billpackageorders.update)
    .delete(billpackageorders.delete);

  // Finish by binding the bill middleware
  app.param('billpackageorderId', billpackageorders.billPackageOrderByID);
};
