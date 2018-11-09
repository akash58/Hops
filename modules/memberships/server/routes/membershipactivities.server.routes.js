'use strict';

/**
 * Module dependencies.
 */
var membershipactivitiesPolicy = require('../policies/membershipactivities.server.policy'),
  membershipactivities = require('../controllers/membershipactivities.server.controller');

module.exports = function(app) {

  app.route('/api/membershipactivities').all(membershipactivitiesPolicy.isAllowed)
    .get(membershipactivities.list)
    .post(membershipactivities.create);

  app.route('/api/membershipactivities/:membershipactivityId').all(membershipactivitiesPolicy.isAllowed)
    .get(membershipactivities.read);

  app.param('membershipactivityId', membershipactivities.membershipactivityByID);
};
