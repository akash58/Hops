'use strict';

// Serials service used for communicating with the serials REST endpoint
angular.module('serials').factory('Serials', ['$resource',
  function($resource) {
    return $resource('/api/serials/:serialId', {
      serialId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
