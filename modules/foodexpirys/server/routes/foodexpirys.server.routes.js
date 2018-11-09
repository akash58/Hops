'use strict';

/**
 * Module dependencies.
 */
var foodexpirys = require('../controllers/foodexpirys.server.controller'),
  foodExpiryInventoryActivities = require('../controllers/foodexpirysinventoryactivities.server.controller');

module.exports = function(app) {
  // Stock Audit Routes
  app.route('/api/foodexpirys')
    .get(foodexpirys.listFoodExpirys)
    .post(foodexpirys.createFoodExpiry);

  app.route('/api/foodexpirys/count')
    .get(foodexpirys.count);

  app.route('/api/foodexpirys/:foodexpirysId')
    .get(foodexpirys.readFoodExpiry);
    // .put(foodexpirys.updateFoodExpiry);

  // Finish by binding the Stock Audit middleware
  app.param('foodexpirysId', foodexpirys.foodExpiryByID);

  // Purchase Order Inventory Activity Routes
  app.route('/api/foodexpiryinventoryactivities')
    .get(foodExpiryInventoryActivities.listFoodExpiryInventoryActivitys)
    .post(foodExpiryInventoryActivities.createFoodExpiryInventoryActivity);

  app.route('/api/foodexpiryinventoryactivities/:foodExpiryInventoryActivityId')
    .get(foodExpiryInventoryActivities.readFoodExpiryInventoryActivity);
    // .put(foodexpirys.updateFoodExpiryInventoryActivity);

  // Finish by binding the Stock Audit Inventory Activity middleware
  app.param('foodExpiryInventoryActivityId', foodExpiryInventoryActivities.foodExpiryInventoryActivityByID);

};
