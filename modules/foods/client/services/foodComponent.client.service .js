// Foods service used to communicate Foods REST endpoints
(function () {
  'use strict';

  angular
    .module('foods')
    .factory('FoodComponentService', FoodComponentService);

  FoodComponentService.$inject = ['$resource'];

  function FoodComponentService($resource) {
    return $resource('/api/foodcomponent/:foodComponentId', {
      foodComponentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
