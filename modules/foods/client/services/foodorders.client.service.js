// Foods service used to communicate Foods REST endpoints
(function () {
  'use strict';

  angular
    .module('foods')
    .factory('FoodOrdersService', FoodOrdersService);

  FoodOrdersService.$inject = ['$resource'];

  function FoodOrdersService($resource) {
    return $resource('/api/foodorders/:foodorderId', {
      foodorderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
