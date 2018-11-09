'use strict';

// Specdescs service used for communicating with the components REST endpoint
angular.module('specdescs').factory('Specdescs', ['$resource',
  function($resource) {
    return $resource('/api/specdescs/:specdescId', {
      specdescId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
