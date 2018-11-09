(function () {
  'use strict';

  angular
    .module('rentals')
    .factory('PackageorderService', PackageorderService);

  PackageorderService.$inject = ['$resource', '$log'];

  function PackageorderService($resource) {
    return $resource('/api/packageorders/:packageorderId', {
      packageorderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
