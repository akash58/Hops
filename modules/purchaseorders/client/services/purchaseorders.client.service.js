// purchaseorders service used to communicate purchaseorders REST endpoints
(function () {
  'use strict';

  angular
    .module('purchaseorders')
    .factory('PurchaseordersService', PurchaseordersService);

  PurchaseordersService.$inject = ['$resource'];

  function PurchaseordersService($resource) {
    return $resource('/api/purchaseorders/:purchaseorderId', {
      purchaseorderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
