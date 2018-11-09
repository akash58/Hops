'use strict';

/**
 * Module dependencies
 */
// var foodorderPolicy = require('../policies/foodorder.server.policy'),
var foodorders = require('../controllers/foodorder.server.controller');

module.exports = function (app) {
  // foodorders collection routes
  app.route('/api/foodorders')// .all(foodorderPolicy.isAllowed)
    .get(foodorders.list)
    .post(foodorders.saveAll);

  // Single foodorder routes
  app.route('/api/foodorders/:foodorderId')// .all(foodorderPolicy.isAllowed)
    .get(foodorders.read)
    .put(foodorders.update)
    .delete(foodorders.delete);

  // Finish by binding the foodorder middleware
  app.param('foodorderId', foodorders.foodorderByID);
};
