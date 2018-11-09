'use strict';

/**
 * Module dependencies
 */
var foodorderReportPolicy = require('../policies/foodorderreport.server.policy'),
  foodorderreport = require('../controllers/foodorderreport.server.controller');

module.exports = function(app) {
  app.route('/api/foodorderreport').all(foodorderReportPolicy.isAllowed)
    .get(foodorderreport.summary);

  // Finish by binding the Baseunit middleware
  // app.param('foodorderreportId', foodorderreport.foodorderReportByID);
};
