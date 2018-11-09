'use strict';

/**
 * Module dependencies.
 */
var specdescs = require('../controllers/specdescs.server.controller');
// users = require('../../../users/server/controllers/users.server.controller'),

module.exports = function(app) {
  // SpecDesc Routes
  app.route('/api/specdescs')
    .get(specdescs.list)
    .post(specdescs.create);

  app.route('/api/specdescs/:specdescId')
    // .get(articles.read)
    // .delete(articles.delete)
    .put(specdescs.update);

  // Finish by binding the specdesc middleware
  app.param('specdescId', specdescs.specdescByID);
};
