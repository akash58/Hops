'use strict';

// Rentalarchives service used for communicating with the rentalarchives REST endpoint
angular.module('payments').factory('Rentalarchives', ['$resource',
  function($resource) {
    return $resource('/api/rentalarchives/:rentalarchiveId', {
      rentalarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
