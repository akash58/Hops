'use strict';

// Billarchives service used for communicating with the billarchives REST endpoint
angular.module('payments').factory('Billarchives', ['$resource',
  function($resource) {
    return $resource('/api/billarchives/:billarchiveId', {
      billarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
