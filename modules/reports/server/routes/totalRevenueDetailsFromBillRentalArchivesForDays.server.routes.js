'use strict';

/**
 * Module dependencies.
 */
var	totalRevenueDetailsFromBillRentalArchivesForDays = require('../controller/totalRevenueDetailsFromBillRentalArchivesForDays.server.controller');

module.exports = function(app) {
  // Billarchives Routes
  app.route('/totalRevenueDetailsFromBillRentalArchivesForDays')
    .get(totalRevenueDetailsFromBillRentalArchivesForDays.summary);
};
