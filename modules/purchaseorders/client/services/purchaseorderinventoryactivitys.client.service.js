// purchaseorders service used to communicate purchaseorders REST endpoints
(function () {
  'use strict';

  angular
    .module('purchaseorders')
    .factory('PurchaseOrderInventoryActivitysService', PurchaseOrderInventoryActivitysService);

  PurchaseOrderInventoryActivitysService.$inject = ['$resource'];

  function PurchaseOrderInventoryActivitysService($resource) {
    return $resource('/api/purchaseorderinventoryactivities/:purchaseOrderInventoryActivityId', {
      purchaseOrderInventoryActivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

