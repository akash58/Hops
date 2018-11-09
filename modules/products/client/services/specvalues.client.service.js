'use strict';

// Specvalues service used for communicating with the components REST endpoint
angular.module('specvalues').factory('Specvalues', ['$resource',
  function($resource) {
    return $resource('/api/specvalues/:specvalueId', {
      specvalueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
