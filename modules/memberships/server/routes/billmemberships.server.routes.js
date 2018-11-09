'use strict';

/**
 * Module dependencies.
 */
var billmembershipsPolicy = require('../policies/billmemberships.server.policy'),
  billmemberships = require('../controllers/billmemberships.server.controller');

module.exports = function(app) {
	// billmemberships Routes
  app.route('/api/billmemberships').all(billmembershipsPolicy.isAllowed)
    .get(billmemberships.list)
    .post(billmemberships.create);

  app.route('/api/billmemberships/:billmembershipId').all(billmembershipsPolicy.isAllowed)
    .get(billmemberships.read)
    .delete(billmemberships.delete);

	// Finish by binding the billmembershipId middleware
  app.param('billmembershipId', billmemberships.billMembershipByID);
};
