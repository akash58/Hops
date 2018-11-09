'use strict';

// Billfoodorderarchives service used for communicating with the Billfoodorderarchives REST endpoint
angular.module('payments').factory('Billmembershiparchives', ['$resource',
  function($resource) {
    return $resource('/api/billmembershiparchives/:billmembershiparchiveId', {
      billmembershiparchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
