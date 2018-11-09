'use strict';

/**
 * Module dependencies
 */
// var rentalsPolicy = require('../policies/rental.server.policy'),
var billrentals = require('../controllers/billrentals.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/billrentals') // .all(rentalsPolicy.isAllowed)
    .get(billrentals.list)
    .post(billrentals.create);

  // Single article routes
  app.route('/api/billrentals/:billrentalId')// .all(rentalsPolicy.isAllowed)
    .get(billrentals.read)
    // .put(billrentals.update)
    .delete(billrentals.delete);

  // Finish by binding the bill middleware
  app.param('billrentalId', billrentals.billrentalByID);
};
