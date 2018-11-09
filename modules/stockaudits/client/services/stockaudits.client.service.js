// Stockaudits service used to communicate Stockaudits REST endpoints
(function () {
  'use strict';

  angular
    .module('stockaudits')
    .factory('StockauditsService', StockauditsService);

  StockauditsService.$inject = ['$resource'];

  function StockauditsService($resource) {
    return $resource('/api/stockaudits/:stockauditId', {
      stockauditId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
