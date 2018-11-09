'use strict';

/**
 * Module dependencies.
 */
var contents = require('../controllers/contents.server.controller'),
  contentsPolicy = require('../policies/contents.server.policy');

module.exports = function(app) {
  // Contents Routes
  app.route('/api/contents').all(contentsPolicy.isAllowed)
    .get(contents.list)
    .post(contents.create);

  app.route('/api/contents/:contentId').all(contentsPolicy.isAllowed)
    .get(contents.read)
    .put(contents.update)
    .delete(contents.delete);

  // Finish by binding the product middleware
  app.param('contentId', contents.contentByID);
};
