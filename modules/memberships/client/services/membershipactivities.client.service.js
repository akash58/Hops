(function () {
  'use strict';

  angular
    .module('memberships')
    .factory('MembershipactivitiesService', MembershipactivitiesService);

  MembershipactivitiesService.$inject = ['$resource'];

  function MembershipactivitiesService($resource) {
    return $resource('/api/membershipactivities/:membershipactivityId', {
      membershipactivityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
