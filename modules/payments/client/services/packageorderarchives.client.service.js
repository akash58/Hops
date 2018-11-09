'use strict';

// Packageorderarchives service used for communicating with the packageorderarchives REST endpoint
angular.module('payments').factory('Packageorderarchives', ['$resource',
  function($resource) {
    return $resource('/api/packageorderarchives/:packageorderarchiveId', {
      packageorderarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
