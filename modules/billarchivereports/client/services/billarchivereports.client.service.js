// billarchivereports service used to communicate billarchivereports REST endpoints
(function () {
  'use strict';

  angular
    .module('billarchivereports')
    .factory('BillarchivereportsService', BillarchivereportsService);

  BillarchivereportsService.$inject = ['$resource'];

  function BillarchivereportsService($resource) {
    return $resource('/api/billarchivereports/:billarchivereportId', {
      billarchivereportId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
