'use strict';

/**
  * Module dependencies
*/
var purchaseordersPolicy = require('../policies/purchaseorders.server.policy'),
  purchaseorders = require('../controllers/purchaseorders.server.controller'),
  purchaseorderinventoryactivities = require('../controllers/purchaseorderinventoryactivities.server.controller');
  // incrementparameters = require('../controllers/incrementparameters.server.controller');

module.exports = function(app) {
  // purchaseorders Routes
  app.route('/api/purchaseorders').all(purchaseordersPolicy.isAllowed)
  .get(purchaseorders.listPurchaseOrders)
  .post(purchaseorders.createPurchaseorder);

  // purchaseorders Count
  app.route('/api/purchaseorders/count')
    .get(purchaseorders.count);

  app.route('/api/purchaseorders/:purchaseorderId').all(purchaseordersPolicy.isAllowed)
  .get(purchaseorders.read);
  // .put(purchaseorders.update)
  // .delete(purchaseorders.delete);

  // Finish by binding the purchaseorder middleware
  app.param('purchaseorderId', purchaseorders.purchaseorderByID);

  // Purchase Order Inventory Activity Routes
  app.route('/api/purchaseorderinventoryactivities')
    .get(purchaseorderinventoryactivities.listPurchaseOrderInventoryActivitys)
		.post(purchaseorderinventoryactivities.createPurchaseOrderInventoryActivity);

  app.route('/api/purchaseorderinventoryactivities/:purchaseOrderInventoryActivityId')
		.get(purchaseorderinventoryactivities.readPurchaseOrderInventoryActivity);
		// .put(purchaseorderinventoryactivities.updatePurchaseOrderInventoryActivity)

	// Finish by binding the Purchase Order Inventory Activity middleware
  app.param('purchaseOrderInventoryActivityId', purchaseorderinventoryactivities.purchaseOrderInventoryActivityByID);


  /* // incrementparameters Routes
	app.route('/api/incrementparameters')
		.get(incrementparameters.list)
		.post(incrementparameters.create);

	app.route('/api/incrementparameters/:incrementparameterId')
		.get(incrementparameters.read)
		.put(incrementparameters.update);
		//.delete(users.requiresLogin, incrementparameters.delete);

	// Finish by binding the incrementparameter middleware
	app.param('incrementparameterId', incrementparameters.incrementParameterByID);
 */
};
