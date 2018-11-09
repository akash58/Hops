'use strict';

/**
 * Module dependencies
 */
var packageordersPolicy = require('../policies/packageorders.server.policy'),
  packageorders = require('../controllers/packageorders.server.controller');

module.exports = function(app) {
  app.route('/api/packageorders').all(packageordersPolicy.isAllowed)
    .get(packageorders.list)
    .post(packageorders.create);

  app.route('/api/packageorders/:packageorderId').all(packageordersPolicy.isAllowed)
    .get(packageorders.read)
    .put(packageorders.update)
    .delete(packageorders.delete);

  app.param('packageorderId', packageorders.packageorderById);
};
