'use strict';

/**
 * Module dependencies.
 */
var products = require('../controllers/products.server.controller'),
  productsPolicy = require('../policies/products.server.policy');

module.exports = function(app) {
  // Product Routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  app.route('/api/products/count').all(productsPolicy.isAllowed)
    .get(products.count);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update);

  // Finish by binding the product middleware
  app.param('productId', products.productByID);
};
