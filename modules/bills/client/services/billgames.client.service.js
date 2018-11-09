(function () {
  'use strict';

  // Billfoodorders service used for communicating with the Billgames REST endpoint
  angular.module('bills').factory('Billgames', ['$resource',
    function($resource) {
      return $resource('/api/billgames/:billgameId', {
        billgameId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);
}());
