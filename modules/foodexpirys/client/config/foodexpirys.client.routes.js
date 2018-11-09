'use strict';

// Setting up route
angular.module('foodexpirys').config(['$stateProvider',
  function($stateProvider) {
    // Foods state routing
    $stateProvider.
    state('listFoodExpirys', {
      url: '/foodexpirys',
      templateUrl: 'modules/foodexpirys/client/views/foodexpirys.client.view.html'
    });
  }
]);
