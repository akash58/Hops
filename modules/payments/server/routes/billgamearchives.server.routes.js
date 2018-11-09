'use strict';

/**
 * Module dependencies.
 */
var billgamearchives = require('../controllers/billgamearchives.server.controller');

module.exports = function(app) {
  // BillGameArchives Routes
  app.route('/api/billgamearchives')
    .get(billgamearchives.list)
    .post(billgamearchives.create);

  app.route('/api/billgamearchives/:billgamearchiveId')
    .get(billgamearchives.read);
    // .put(users.requiresLogin, billgamearchives.update);

  // Finish by binding the BillGameArchives middleware
  app.param('billgamearchiveId', billgamearchives.billgamearchiveByID);
};
