'use strict';

// contentgroup service used for communicating with the contentgroups REST endpoint
angular.module('contents').factory('Contents', ['$resource',
  function($resource) {
    return $resource('/api/contents/:contentId', {
      contentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
