'use strict';

/**
 * Module dependencies
 */
var unitTypesPolicy = require('../policies/unitTypes.server.policy'),
  unitTypes = require('../controllers/unitTypes.server.controller');

module.exports = function(app) {
  // Units Routes
  app.route('/api/unitTypes').all(unitTypesPolicy.isAllowed)
    .get(unitTypes.list)
    .post(unitTypes.create);

  app.route('/api/unitTypes/count')
    .get(unitTypes.count);

  app.route('/api/unitTypes/:unitTypeId').all(unitTypesPolicy.isAllowed)
    .get(unitTypes.read)
    .put(unitTypes.update)
    .delete(unitTypes.delete);

  // Finish by binding the Unit middleware
  app.param('unitTypeId', unitTypes.unitTypeByID);
};
