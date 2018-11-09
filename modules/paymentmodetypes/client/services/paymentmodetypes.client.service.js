// paymentmodetypes service used to communicate paymentmodetypes REST endpoints
(function () {
  'use strict';

  angular
    .module('paymentmodetypes')
    .factory('PaymentmodetypesService', PaymentmodetypesService);

  PaymentmodetypesService.$inject = ['$resource'];

  function PaymentmodetypesService($resource) {
    return $resource('/api/paymentmodetypes/:paymentmodetypeId', {
      paymentmodetypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
