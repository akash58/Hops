'use strict';

/**
 * Module dependencies
 */
// var rentalsPolicy = require('../policies/rental.server.policy'),
var billgames = require('../controllers/billgames.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/billgames') // .all(rentalsPolicy.isAllowed)
    .get(billgames.list)
    .post(billgames.create);

  // Single article routes
  app.route('/api/billgames/:billgameId')// .all(rentalsPolicy.isAllowed)
    .get(billgames.read)
    // .put(billgames.update)
    .delete(billgames.delete);

  // Finish by binding the bill middleware
  app.param('billgameId', billgames.billGameByID);
};
