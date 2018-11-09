'use strict';

/**
 * Module dependencies.
 */
var	inventoryactivities = require('../controllers/inventoryactivities.server.controller');

module.exports = function(app) {
	// Inventory Activity Routes
  app.route('/api/inventoryactivities')
		.get(inventoryactivities.list)
		.post(inventoryactivities.create);
};
