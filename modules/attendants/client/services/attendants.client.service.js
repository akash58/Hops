// Attendants service used to communicate Attendants REST endpoints
(function () {
  'use strict';

  angular
    .module('attendants')
    .factory('AttendantsService', AttendantsService);

  AttendantsService.$inject = ['$resource'];

  function AttendantsService($resource) {
    return $resource('/api/attendants/:attendantId', {
      attendantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
