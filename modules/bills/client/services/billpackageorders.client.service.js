(function () {
  'use strict';

  // Billfoodorders service used for communicating with the Billfoodorders REST endpoint
  angular.module('bills').factory('Billpackageorders', ['$resource',
    function($resource) {
      return $resource('/api/billpackageorders/:billpackageorderId', {
        billpackageorderId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);
}());
