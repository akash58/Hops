// purchaseorders service used to communicate purchaseorders REST endpoints
(function () {
  'use strict';

  angular
    .module('stockaudits')
    .factory('StockAuditInventoryActivitysService', StockAuditInventoryActivitysService);

  StockAuditInventoryActivitysService.$inject = ['$resource'];

  function StockAuditInventoryActivitysService($resource) {
    return $resource('/api/stockauditinventoryactivities/:stockAuditInventoryActivityId', {
      stockAuditInventoryActivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

