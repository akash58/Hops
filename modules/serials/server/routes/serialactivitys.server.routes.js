'use strict';

/**
 * Module dependencies.
 */
var serialactivitys = require('../controllers/serialactivitys.server.controller'),
  serialactivitysPolicy = require('../policies/serialactivitys.server.policy ');

module.exports = function(app) {
  // Serialactiviy Routes
  app.route('/api/serialactivitys').all(serialactivitysPolicy.isAllowed)
    .get(serialactivitys.list)
    .post(serialactivitys.create);

  app.route('/api/serialactivitys/:specvalueId').all(serialactivitysPolicy.isAllowed)
    .get(serialactivitys.read);
    // .put(users.requiresLogin, serialactivitys.update);

  // Finish by binding the serialactivity middleware
  app.param('serialactivityId', serialactivitys.serialactivityByID);
};
