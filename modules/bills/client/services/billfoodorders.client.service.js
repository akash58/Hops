(function () {
  'use strict';

  // Billfoodorders service used for communicating with the Billfoodorders REST endpoint
  angular.module('bills').factory('Billfoodorders', ['$resource',
    function($resource) {
      return $resource('/api/billfoodorders/:billfoodorderId', {
        billfoodorderId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);
}());
