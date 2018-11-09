'use strict';

/**
 * Module dependencies.
 */
var	totalMembershipRevenueOfDays = require('../controller/totalMembershipRevenueOfDays.server.controller');

module.exports = function(app) {
  // TotalMembershipRevenueOfDays Routes
  app.route('/totalMembershipRevenueOfDays')
    .get(totalMembershipRevenueOfDays.summary);
};
