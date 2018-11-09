'use strict';

/**
 * Module dependencies
 */
var paymentsPolicy = require('../policies/payments.server.policy'),
  payments = require('../controllers/payments.server.controller');


module.exports = function(app) {
  // payments Routes
  app.route('/api/payments').all(paymentsPolicy.isAllowed)
    .get(payments.list)
    .post(payments.create);

  // payments Count
  app.route('/api/payments/count')
    .get(payments.count);


  app.route('/api/payments/:paymentId').all(paymentsPolicy.isAllowed)
    .get(payments.read)
    .put(payments.update);
    // .delete(stockaudits.delete);

  // Finish by binding the payments middleware
  app.param('paymentId', payments.paymentByID);

  // Stockaudit Inventory Activity Routes
  /* app.route('/api/stockauditinventoryactivities')
    .get(stockauditinventoryactivities.listStockAuditInventoryActivitys)
    .post(stockauditinventoryactivities.createStockAuditInventoryActivity);

  app.route('/api/stockauditinventoryactivities/:stockAuditInventoryActivityId')
    .get(stockauditinventoryactivities.readStockAuditInventoryActivity);

  // Finish by binding the Stock Audit Inventory Activity middleware
  app.param('stockAuditInventoryActivityId', stockauditinventoryactivities.stockAuditInventoryActivityByID); */
};
