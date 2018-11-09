'use strict';

// Foodorderarchives service used for communicating with the foodorderarchives REST endpoint
angular.module('payments').factory('Foodorderarchives', ['$resource',
  function($resource) {
    return $resource('/api/foodorderarchives/:foodorderarchiveId', {
      foodorderarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
