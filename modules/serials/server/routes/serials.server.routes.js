'use strict';

/**
 * Module dependencies.
 */
var serials = require('../controllers/serials.server.controller'),
  serialsPolicy = require('../policies/serials.server.policy');

module.exports = function(app) {
  // Serials Routes
  app.route('/api/serials').all(serialsPolicy.isAllowed)
    .get(serials.list)
    .post(serials.create);

  app.route('/api/serials/count').all(serialsPolicy.isAllowed)
    .get(serials.count);

  app.route('/api/serials/:serialId').all(serialsPolicy.isAllowed)
    .get(serials.read)
    .put(serials.update);
    // .delete(users.requiresLogin, serials.delete);

  // Finish by binding the specvalue middleware
  app.param('serialId', serials.serialByID);
};
