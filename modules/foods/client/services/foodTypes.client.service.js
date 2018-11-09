// Foods service used to communicate Foods REST endpoints
(function () {
  'use strict';

  angular
    .module('foods')
    .factory('FoodTypeService', FoodTypeService);

  FoodTypeService.$inject = ['$resource'];

  function FoodTypeService($resource) {
    return $resource('/api/foodType/:foodTypeId', {
      foodTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
