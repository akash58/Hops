// InventoryActivitys service used for communicating with the foods REST endpoint

(function () {
  'use strict';

  angular
    .module('purchaseorders')
    .factory('IncrementParametersService', IncrementParametersService);

  IncrementParametersService.$inject = ['$resource'];

  function IncrementParametersService($resource) {
    return $resource('/api/incrementparameters/:incrementparameterId', {
      incrementparameterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
