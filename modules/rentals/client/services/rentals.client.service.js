(function () {
  'use strict';

  angular
    .module('rentals')
    .factory('RentalsService', RentalsService);

  RentalsService.$inject = ['$resource', '$log'];

  function RentalsService($resource, $log) {
    var Rental = $resource('/api/rentals/:rentalId', {
      rentalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Rental.prototype, {
      createOrUpdate: function () {
        var rental = this;
        return createOrUpdate(rental);
      }
    });

    return Rental;

    function createOrUpdate(rental) {
      if (rental._id) {
        return rental.$update(onSuccess, onError);
      } else {
        return rental.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(rental) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
