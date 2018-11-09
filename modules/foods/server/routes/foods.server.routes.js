'use strict';

/**
 * Module dependencies
 */
var foodsPolicy = require('../policies/foods.server.policy'),
  foods = require('../controllers/foods.server.controller');

module.exports = function(app) {
  // Foods Routes
  app.route('/api/foods').all(foodsPolicy.isAllowed)
    .get(foods.listFood)
    .post(foods.createFood);

  app.route('/api/foodType').all(foodsPolicy.isAllowed)
    .get(foods.listFoodType)
    .post(foods.createFoodType);

  app.route('/api/foodcomponent').all(foodsPolicy.isAllowed)
    .get(foods.listFoodComponent)
    .post(foods.createFoodComponent);

  app.route('/api/foodcomponent/count')
    .get(foods.count);

  app.route('/api/foodcomponent/:foodComponentId').all(foodsPolicy.isAllowed)
    .get(foods.read)
    .put(foods.updateFoodComponent)
    .delete(foods.deleteFoodComponent);

  app.route('/api/foodType/countForFoodType')
    .get(foods.countForFoodType);

  app.route('/api/foods/:foodId').all(foodsPolicy.isAllowed)
    .get(foods.read)
    .put(foods.update)
    .delete(foods.delete);

  app.route('/api/foodType/:foodTypeId').all(foodsPolicy.isAllowed)
    .get(foods.read)
    .put(foods.updateFoodType)
    .delete(foods.deleteFoodType);


  // Finish by binding the Food middleware
  app.param('foodId', foods.foodByID);
  app.param('foodTypeId', foods.foodTypeByID);
  app.param('foodComponentId', foods.FoodcomponentByID);
};
