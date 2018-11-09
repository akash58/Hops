'use strict';

/**
 * Module dependencies
 */
// var rentalsPolicy = require('../policies/rental.server.policy'),
var billfoodorders = require('../controllers/billfoodorders.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/billfoodorders') // .all(rentalsPolicy.isAllowed)
    .get(billfoodorders.list)
    .post(billfoodorders.create);

  // Single article routes
  app.route('/api/billfoodorders/:billfoodorderId')// .all(rentalsPolicy.isAllowed)
    .get(billfoodorders.read)
    // .put(billfoodorders.update)
    .delete(billfoodorders.delete);

  // Finish by binding the bill middleware
  app.param('billfoodorderId', billfoodorders.billFoodOrderByID);
};
