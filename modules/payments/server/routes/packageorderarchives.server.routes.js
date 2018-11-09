'use strict';

/**
 * Module dependencies.
 */
var packageorderarchives = require('../controllers/packageorderarchives.server.controller');

module.exports = function(app) {
  // packageorderarchives Routes
  app.route('/api/packageorderarchives')
    .get(packageorderarchives.list)
    .post(packageorderarchives.create);

  app.route('/api/packageorderarchives/:packageorderarchiveId')
    .get(packageorderarchives.read);
    // .put(users.requiresLogin, packageorderarchives.update);

  // Finish by binding the packageorderarchive middleware
  app.param('packageorderarchiveId', packageorderarchives.packageorderarchiveByID);
};
