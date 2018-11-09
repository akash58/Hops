// InventoryActivitys service used for communicating with the foods REST endpoint

(function () {
  'use strict';

  angular
    .module('purchaseorders')
    .factory('InventoryActivitysService', InventoryActivitysService);

  InventoryActivitysService.$inject = ['$resource'];

  function InventoryActivitysService($resource) {
    return $resource('/api/inventoryactivities/:inventoryActivityId', {
      inventoryActivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
