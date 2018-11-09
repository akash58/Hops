// Baseunits service used to communicate Baseunits REST endpoints
(function () {
  'use strict';

  angular
    .module('foodorderreport')
    .factory('foodorderreportsService', foodorderreportsService);

  foodorderreportsService.$inject = ['$resource'];

  function foodorderreportsService($resource) {
    return $resource('/api/foodorderreport/:foodorderreportId', {
      foodorderreportId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  }
}());
