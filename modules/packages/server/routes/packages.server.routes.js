'use strict';

/**
 * Module dependencies
 */
var packagesPolicy = require('../policies/packages.server.policy'),
  packages = require('../controllers/packages.server.controller');

module.exports = function(app) {
  // Packages Routes
  app.route('/api/packages').all(packagesPolicy.isAllowed)
    .get(packages.list)
    .post(packages.create);

  app.route('/api/packages/count')
    .get(packages.count);

  app.route('/api/packagefoodtypes').all(packagesPolicy.isAllowed)
    .get(packages.listFoodTypeInPackage)
    .post(packages.addFoodTypeInPackage);

  app.route('/api/packages/:packageId').all(packagesPolicy.isAllowed)
    .get(packages.read)
    .put(packages.update)
    .delete(packages.delete);

  app.route('/api/packagefoodtypes/:packageFoodTypeId').all(packagesPolicy.isAllowed)
    .get(packages.readFoodTypeInPackage)
    .put(packages.updateFoodTypeInPackage)
    .delete(packages.deleteFoodTypeInPackage);

  // Finish by binding the Package middleware
  app.param('packageId', packages.packageByID);
  app.param('packageFoodTypeId', packages.foodTypeInPackageByID);
};
