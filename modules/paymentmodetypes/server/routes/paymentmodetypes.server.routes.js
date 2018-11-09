'use strict';

/**
 * Module dependencies
 */
var paymentmodetypesPolicy = require('../policies/paymentmodetypes.server.policy'),
  paymentmodetypes = require('../controllers/paymentmodetypes.server.controller');

module.exports = function(app) {
  // Baseunits Routes
  app.route('/api/paymentmodetypes').all(paymentmodetypesPolicy.isAllowed)
    .get(paymentmodetypes.list)
    .post(paymentmodetypes.create);

  app.route('/api/paymentmodetypes/:paymentmodetypeId').all(paymentmodetypesPolicy.isAllowed)
    .get(paymentmodetypes.read)
    .put(paymentmodetypes.update);

  // Finish by binding the Baseunit middleware
  app.param('paymentmodetypeId', paymentmodetypes.paymentModeTypeByID);
};
