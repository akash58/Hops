(function () {
  'use strict';

  angular
    .module('memberships')
    .factory('BillmembershipsService', BillmembershipsService);

  BillmembershipsService.$inject = ['$resource'];

  function BillmembershipsService($resource) {
    return $resource('/api/billmemberships/:billmembershipId', {
      billmembershipId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
