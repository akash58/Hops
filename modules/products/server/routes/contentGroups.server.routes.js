'use strict';

/**
 * Module dependencies.
 */
var contentgroups = require('../controllers/contentgroups.server.controller'),
  contentgroupsPolicy = require('../policies/contentgroups.server.policy');

module.exports = function(app) {
  // ContentsGroup Routes
  app.route('/api/contentgroups').all(contentgroupsPolicy.isAllowed)
    .get(contentgroups.list)
    .post(contentgroups.create);

  app.route('/api/contentgroups/:contentgroupId').all(contentgroupsPolicy.isAllowed)
    .get(contentgroups.read)
    .put(contentgroups.update)
    .delete(contentgroups.delete);

  // Finish by binding the product middleware
  app.param('contentgroupId', contentgroups.contentgroupByID);
};
