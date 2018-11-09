'use strict';

// Billpackageorderarchives service used for communicating with the billpackageorderarchives REST endpoint
angular.module('payments').factory('Billpackageorderarchives', ['$resource',
  function($resource) {
    return $resource('/api/billpackageorderarchives/:billpackageorderarchiveId', {
      billpackageorderarchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
