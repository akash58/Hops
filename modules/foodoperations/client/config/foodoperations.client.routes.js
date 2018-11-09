'use strict';

// Setting up route
angular.module('foodoperations').config(['$stateProvider',
  function($stateProvider) {
    // Foods state routing
    $stateProvider.
    state('FoodOperations', {
      url: '/foodoperations',
      templateUrl: 'modules/foodoperations/client/views/foodoperations.client.view.html'
    });
  }
]);
