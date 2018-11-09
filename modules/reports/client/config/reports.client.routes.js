(function () {
  'use strict';

  angular
    .module('reports')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.totalRevenueReports', {
        url: '/totalRevenueReports',
        templateUrl: '/modules/reports/client/views/totalRevenueReports.client.view.html',
        controller: 'TotalRevenueReportController',
        controllerAs: 'vm',
        // resolve: {
        //   tableResolve: getTables
        // },
        data: {
          pageTitle: 'Total Revenue Report'
        }
      });
  }

  // getTables.$inject = ['$stateParams', 'TablesService'];

  // function getTables($stateParams, TablesService) {
  //   return TablesService.query().$promise;
  // }
}());
