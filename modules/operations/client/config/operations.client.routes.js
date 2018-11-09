(function () {
  'use strict';

  angular
    .module('operations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('operations', {
        abstract: true,
        url: '/operations',
        template: '<ui-view/>'
      })
      .state('operations.view', {
        url: 'overview',
        templateUrl: '/modules/operations/client/views/operations.client.view.html',
        controller: 'OperationsController',
        controllerAs: 'vm',
        // resolve: {
        //   tableResolve: getTables
        // },
        data: {
          pageTitle: 'Operation Overview'
        }
      });
  }

  // getTables.$inject = ['$stateParams', 'TablesService'];

  // function getTables($stateParams, TablesService) {
  //   return TablesService.query().$promise;
  // }
}());
