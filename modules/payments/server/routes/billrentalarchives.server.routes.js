'use strict';

/**
 * Module dependencies.
 */
var billrentalarchives = require('../controllers/billrentalarchives.server.controller');

module.exports = function(app) {
  // Billrentalarchives Routes
  app.route('/api/billrentalarchives')
    .get(billrentalarchives.list)
    .post(billrentalarchives.create);

  app.route('/api/billrentalarchives/:billrentalarchiveId')
    .get(billrentalarchives.read);
    // .put(users.requiresLogin, billrentalarchives.update);

  // Finish by binding the Billrentalactivity middleware
  app.param('billrentalarchiveId', billrentalarchives.billrentalarchiveByID);
};
