(function () {
  'use strict';

  angular
    .module('rentals')
    .factory('BillsService', BillsService);

  BillsService.$inject = ['$resource', '$log'];

  function BillsService($resource, $log) {
    var bill = $resource('/api/bills/:billId', {
      billId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    return bill;
  }
}());
