(function () {
  'use strict';

  // foodOrder service used for communicating with the foodOrders REST endpoint
  angular.module('bills').factory('Billrentals', ['$resource',
    function($resource) {
      return $resource('/api/billrentals/:billrentalId', {
        billrentalId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);
}());
