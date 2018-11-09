'use strict';

// FoodTypes service used for communicating with the foodtypes REST endpoint
angular.module('packages').factory('PackageFoodTypeService', ['$resource',
  function($resource) {
    return $resource('/api/packagefoodtypes/:packageFoodTypeId', {
      packageFoodTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
