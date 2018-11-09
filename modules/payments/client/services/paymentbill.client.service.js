'use strict';

// foodOrder service used for communicating with the foodOrders REST endpoint
angular.module('payments').factory('PaymentBills', ['$resource',
  function($resource) {
    return $resource('/api/paymentbills/:paymentbillId', {
      paymentbillId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
