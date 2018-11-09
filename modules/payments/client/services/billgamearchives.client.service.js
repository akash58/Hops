'use strict';

// Billgamearchives service used for communicating with the billgamearchives REST endpoint
angular.module('payments').factory('Billgamearchives', ['$resource',
  function($resource) {
    return $resource('/api/billgamearchives/:billgamearchiveId', {
      billgamearchiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
