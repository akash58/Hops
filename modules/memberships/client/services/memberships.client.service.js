// Memberships service used to communicate Memberships REST endpoints
(function () {
  'use strict';

  angular
    .module('memberships')
    .factory('MembershipsService', MembershipsService);

  MembershipsService.$inject = ['$resource'];

  function MembershipsService($resource) {
    return $resource('/api/memberships/:membershipId', {
      membershipId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
