// Packages service used to communicate Packages REST endpoints
(function () {
  'use strict';

  angular
    .module('packages')
    .factory('PackagesService', PackagesService);

  PackagesService.$inject = ['$resource'];

  function PackagesService($resource) {
    return $resource('/api/packages/:packageId', {
      packageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
