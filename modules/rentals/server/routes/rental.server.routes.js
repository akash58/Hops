'use strict';

/**
 * Module dependencies
 */
var rentalsPolicy = require('../policies/rental.server.policy'),
  rentals = require('../controllers/rental.server.controller'),
  rentalsummary = require('../controllers/rentalsummary.server.controller'),
  getUnpaidBillForOperations = require('../controllers/getUnpaidBillForOperations.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/rentals').all(rentalsPolicy.isAllowed)
    .get(rentals.list)
    .post(rentals.create);

  // Single article routes
  app.route('/api/rentals/:rentalId').all(rentalsPolicy.isAllowed)
    .get(rentals.read)
    .put(rentals.update)
    .delete(rentals.delete);


  // Finish by binding the article middleware
  app.param('rentalId', rentals.articleByID);

  app.route('/api/rentalsummary')
    .get(rentalsummary.summary);
  app.route('/api/getUnpaidBillForOperations')
    .get(getUnpaidBillForOperations.summary);
};
