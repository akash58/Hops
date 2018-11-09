'use strict';

/**
 * Module dependencies.
 */
var billmembershiparchives = require('../controllers/billmembershiparchives.server.controller');

module.exports = function(app) {
  // billmembershiparchives Routes
  app.route('/api/billmembershiparchives')
    .get(billmembershiparchives.list)
    .post(billmembershiparchives.create);

  app.route('/api/billmembershiparchives/:billmembershiarchivepId')
    .get(billmembershiparchives.read);
    // .put(users.requiresLogin, billmembershiparchives.update)
    // .delete(users.requiresLogin, billmembershiparchives.delete);

  // Finish by binding the billmembershiparchiveId middleware
  app.param('billmembershiparchiveId', billmembershiparchives.billmembershiparchiveByID);
};
