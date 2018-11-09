'use strict';

// Setting up route
angular.module('serials').config(['$stateProvider',
  function($stateProvider) {
    // Serials state routing
    $stateProvider.
    state('listSerials', {
      url: '/serials',
      templateUrl: '/modules/serials/client/views/serials.client.view.html'
    });
  }
]);
