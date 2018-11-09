'use strict';

/**
 * Module dependencies.
 */
var billarchives = require('../controllers/billarchives.server.controller');

module.exports = function(app) {
  // Billarchives Routes
  app.route('/api/billarchives')
    .get(billarchives.list)
    .post(billarchives.create);

  app.route('/api/billarchives/count')
    .get(billarchives.count);

  app.route('/api/billarchives/:billarchiveId')
    .get(billarchives.read);
    // .put(users.requiresLogin, billarchives.update);

  // Finish by binding the Billarchive middleware
  app.param('billarchiveId', billarchives.billarchiveByID);
};
