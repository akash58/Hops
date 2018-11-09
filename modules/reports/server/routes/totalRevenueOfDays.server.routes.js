'use strict';

/**
 * Module dependencies.
 */
var	totalRevenueOfDays = require('../controller/totalRevenueOfDays.server.controller');

module.exports = function(app) {
  // Billarchives Routes
  app.route('/totalRevenueOfDays')
    .get(totalRevenueOfDays.summary);
};
