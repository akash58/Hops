'use strict';

/**
 * Module dependencies
 */
var membershipsPolicy = require('../policies/memberships.server.policy'),
  memberships = require('../controllers/memberships.server.controller');

module.exports = function(app) {
  // Memberships Routes
  app.route('/api/memberships').all(membershipsPolicy.isAllowed)
    .get(memberships.list)
    .post(memberships.create);

  app.route('/api/memberships/:membershipId').all(membershipsPolicy.isAllowed)
    .get(memberships.read)
    .put(memberships.update)
    .delete(memberships.delete);

  // Finish by binding the Membership middleware
  app.param('membershipId', memberships.membershipByID);
};
