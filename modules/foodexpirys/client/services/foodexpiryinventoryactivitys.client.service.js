'use strict';

// Foods service used for communicating with the foods REST endpoint
angular.module('foodexpirys').factory('FoodExpiryInventoryActivitys', ['$resource',
  function($resource) {
    return $resource('/api/foodexpiryinventoryactivities/:foodExpiryInventoryActivityId', {
      foodExpiryInventoryActivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
