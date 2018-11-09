'use strict';

/**
 * Module dependencies
 */
var systemparametersPolicy = require('../policies/systemparameters.server.policy'),
  systemparameters = require('../controllers/systemparameters.server.controller');

module.exports = function(app) {
  // Systemparameters Routes
  app.route('/api/systemparameters').all(systemparametersPolicy.isAllowed)
    .get(systemparameters.list)
    .post(systemparameters.create);

  app.route('/api/systemparameters/insertMany')
    .post(systemparameters.insertMany);

  app.route('/api/systemparameters/count')
    .get(systemparameters.count);

  app.route('/api/systemparameters/:systemparameterId').all(systemparametersPolicy.isAllowed)
    .get(systemparameters.read)
    .put(systemparameters.update)
    .delete(systemparameters.delete);

  // Finish by binding the Systemparameter middleware
  app.param('systemparameterId', systemparameters.systemparameterByID);
};
