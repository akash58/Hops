'use strict';

/**
 * Module dependencies.
 */
var paymentbills = require('../controllers/paymentbills.server.controller');


module.exports = function(app) {
  // paymentbill Routes
  app.route('/api/paymentbills')
    .get(paymentbills.list)
    .post(paymentbills.create);

  app.route('/api/paymentbills/:paymentbillId')
    .get(paymentbills.read)
    .put(paymentbills.update)
    .delete(paymentbills.delete);

  // Finish by binding the paymentbill middleware
  app.param('paymentbillId', paymentbills.paymentBillByID);
};
