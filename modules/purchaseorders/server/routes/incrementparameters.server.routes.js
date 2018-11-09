'use strict';

/**
 * Module dependencies.
 */
var incrementparameters = require('../controllers/incrementparameters.server.controller');


module.exports = function(app) {
	// incrementparameters Routes
  app.route('/api/incrementparameters')
		.get(incrementparameters.list)
		.post(incrementparameters.create);

  app.route('/api/incrementparameters/:incrementparameterId')
		.get(incrementparameters.read)
		.put(incrementparameters.update);
		// .delete(users.requiresLogin, incrementparameters.delete);

	// Finish by binding the incrementparameter middleware
  app.param('incrementparameterId', incrementparameters.incrementParameterByID);
};
