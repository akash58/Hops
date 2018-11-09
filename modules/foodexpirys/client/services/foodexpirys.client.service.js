'use strict';

// Foods service used for communicating with the foods REST endpoint
angular.module('foodexpirys').factory('FoodExpirys', ['$resource',
  function($resource) {
    return $resource('/api/foodexpirys/:foodexpiryId', {
      foodexpirysId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
