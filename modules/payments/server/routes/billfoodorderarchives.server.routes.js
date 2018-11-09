'use strict';

/**
 * Module dependencies.
 */
var billfoodorderarchives = require('../controllers/billfoodorderarchives.server.controller');

module.exports = function(app) {
  // Bill Foodorderarchives Routes
  app.route('/api/billfoodorderarchives')
    .get(billfoodorderarchives.list)
    .post(billfoodorderarchives.create);

  app.route('/api/billfoodorderarchives/:billfoodorderarchiveId')
    .get(billfoodorderarchives.read);
    // .put(users.requiresLogin, billfoodorderarchives.update);

  // Finish by binding the Bill Foodorderarchive middleware
  app.param('billfoodorderarchiveId', billfoodorderarchives.billfoodorderarchiveByID);
};
