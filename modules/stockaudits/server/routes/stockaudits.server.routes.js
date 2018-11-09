'use strict';

/**
 * Module dependencies
 */
var stockauditsPolicy = require('../policies/stockaudits.server.policy'),
  stockaudits = require('../controllers/stockaudits.server.controller'),
  stockauditinventoryactivities = require('../controllers/stockauditinventoryactivities.server.controller');


module.exports = function(app) {
  // Stockaudits Routes
  app.route('/api/stockaudits').all(stockauditsPolicy.isAllowed)
    .get(stockaudits.listStockAudits)
    .post(stockaudits.createStockAudit);

  // Stockaudits Count
  app.route('/api/stockaudits/count')
    .get(stockaudits.count);


  app.route('/api/stockaudits/:stockauditId').all(stockauditsPolicy.isAllowed)
    .get(stockaudits.readStockAudit);
    // .put(stockaudits.update)
    // .delete(stockaudits.delete);

  // Finish by binding the Stockaudit middleware
  app.param('stockauditId', stockaudits.stockauditByID);

  // Stockaudit Inventory Activity Routes
  app.route('/api/stockauditinventoryactivities')
    .get(stockauditinventoryactivities.listStockAuditInventoryActivitys)
    .post(stockauditinventoryactivities.createStockAuditInventoryActivity);

  app.route('/api/stockauditinventoryactivities/:stockAuditInventoryActivityId')
    .get(stockauditinventoryactivities.readStockAuditInventoryActivity);
  // .put(stockauditinventoryactivities.updateStockAuditInventoryActivity);

  // Finish by binding the Stock Audit Inventory Activity middleware
  app.param('stockAuditInventoryActivityId', stockauditinventoryactivities.stockAuditInventoryActivityByID);
};
