'use strict';

/**
 * Module dependencies.
 */
var specvalues = require('../controllers/specvalues.server.controller'),
  specvaluesPolicy = require('../policies/specvalues.server.policy');

module.exports = function(app) {
  // Specvalues Routes
  app.route('/api/specvalues').all(specvaluesPolicy.isAllowed)
    .get(specvalues.list)
    .post(specvalues.create);

  app.route('/api/specvalues/:specvalueId').all(specvaluesPolicy.isAllowed)
    .get(specvalues.read)
    .put(specvalues.update);

  // Finish by binding the specvalue middleware
  app.param('specvalueId', specvalues.specvalueByID);
};
