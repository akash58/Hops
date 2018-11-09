'use strict';

/**
 * Module dependencies
 */
var // pagesPolicy = require('../policies/pages.server.policy'),
  pages = require('../controllers/pages.server.controller');

module.exports = function(app) {
	// page Routes
  app.route('/api/pages')
		.get(pages.list)
		.post(pages.create);

  app.route('/api/pages/:pageId')
		.put(pages.update);

	// Finish by binding the pages middleware
  app.param('pageId', pages.pageByID);
};
