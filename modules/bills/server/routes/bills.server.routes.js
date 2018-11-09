'use strict';

/**
 * Module dependencies
 */
// var rentalsPolicy = require('../policies/rental.server.policy'),
var bills = require('../controllers/bills.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/bills') // .all(rentalsPolicy.isAllowed)
    .get(bills.list)
    .post(bills.create);

  // Single article routes
  app.route('/api/bills/:billId')// .all(rentalsPolicy.isAllowed)
    .get(bills.read)
    .put(bills.update)
    .delete(bills.delete);

  // Finish by binding the bill middleware
  app.param('billId', bills.billByID);
};
