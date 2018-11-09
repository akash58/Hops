'use strict';

/**
 * Module dependencies.
 */
var foodorderarchives = require('../controllers/foodorderarchives.server.controller');

module.exports = function(app) {
  // Foodorderarchives Routes
  app.route('/api/foodorderarchives')
    .get(foodorderarchives.list)
    .post(foodorderarchives.create);

  app.route('/api/foodorderarchives/:foodorderarchiveId')
    .get(foodorderarchives.read);
    // .put(users.requiresLogin, foodorderarchives.update);

  // Finish by binding the Foodorderactivity middleware
  app.param('foodorderarchiveId', foodorderarchives.foodorderarchiveByID);
};
