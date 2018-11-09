'use strict';

// Setting up route
angular.module('components').config(['$stateProvider',
  function($stateProvider) {
    // Components state routing
    $stateProvider.
    state('listComponents', {
      url: '/gametypes',
      templateUrl: 'modules/components/client/views/components.client.view.html'
    });
  }
]);
