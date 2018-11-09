'use strict';

/**
 * Module dependencies.
 */
var rentalarchives = require('../controllers/rentalarchives.server.controller');

module.exports = function(app) {
  // Rentalarchives Routes
  app.route('/api/rentalarchives')
    .get(rentalarchives.list)
    .post(rentalarchives.create);

  app.route('/api/rentalarchives/:rentalarchiveId')
    .get(rentalarchives.read);
    // .put(users.requiresLogin, rentalarchives.update);

  // Finish by binding the Rentalactivity middleware
  app.param('rentalarchiveId', rentalarchives.rentalarchiveByID);
};
