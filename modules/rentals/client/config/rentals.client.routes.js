(function () {
  'use strict';

  angular
    .module('rentals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rentals', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('rentals.details', {
        url: 'tabledetails',
        templateUrl: '/modules/rentals/client/views/rentals.client.view.html',
        controller: 'RentalsController',
        controllerAs: 'vm',
        params: {
          tableId: ''
        },
        // resolve: {
        //   tableResolve: getTables
        // },
        data: {
          pageTitle: 'Rentals'
        }
      });
  }

  // getTables.$inject = ['$stateParams', 'TablesService'];

  // function getTables($stateParams, TablesService) {
  //   return TablesService.query().$promise;
  // }
}());
