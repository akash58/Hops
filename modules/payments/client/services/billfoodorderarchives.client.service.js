'use strict';

// Billfoodorderarchives service used for communicating with the billfoodorderarchives REST endpoint
angular.module('payments').factory('Billfoodorderarchives', ['$resource',
  function($resource) {
    return $resource('/api/billfoodorderarchives/:billfoodorderarchiveId', {
      billfoodorderarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
