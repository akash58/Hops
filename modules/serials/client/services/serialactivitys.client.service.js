'use strict';

// Serialactivitys service used for communicating with the serialactivitys REST endpoint
angular.module('serialactivitys').factory('Serialactivitys', ['$resource',
  function($resource) {
    return $resource('/api/serialactivitys/:serialactivityId', {
      serialactivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
