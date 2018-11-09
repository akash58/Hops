'use strict';

// Setting up route
angular.module('products').config(['$stateProvider',
  function($stateProvider) {
    // Products state routing
    $stateProvider.
    state('listProducts', {
      url: '/games',
      templateUrl: 'modules/products/client/views/products.client.view.html'
    });
  }
]);
