'use strict';

/**
 * Module dependencies.
 */
var components = require('../controllers/components.server.controller');
// users = require('../../../users/server/controllers/users.server.controller'),

module.exports = function(app) {
  // Component Routes
  app.route('/api/components')
    .get(components.list)
    .post(components.create);

  app.route('/api/components/:componentId')
    .get(components.read)
    .put(components.update);

  // Finish by binding the component middleware
  app.param('componentId', components.componentByID);
};
