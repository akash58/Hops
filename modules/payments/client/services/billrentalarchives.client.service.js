'use strict';

// Billrentalarchives service used for communicating with the billrentalarchives REST endpoint
angular.module('payments').factory('Billrentalarchives', ['$resource',
  function($resource) {
    return $resource('/api/billrentalarchives/:billrentalarchiveId', {
      billrentalarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
