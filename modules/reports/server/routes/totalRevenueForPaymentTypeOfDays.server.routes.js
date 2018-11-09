'use strict';

/**
 * Module dependencies.
 */
var	totalRevenueForPaymentTypeOfDays = require('../controller/totalRevenueForPaymentTypeOfDays.server.controller');

module.exports = function(app) {
  // Billarchives Routes
  app.route('/totalRevenueForPaymentTypeOfDays')
    .get(totalRevenueForPaymentTypeOfDays.summary);
};
