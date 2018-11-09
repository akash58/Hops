(function () {
  'use strict';

  angular
    .module('billarchivereports')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('billarchivereports', {
        abstract: true,
        url: '/billarchivereports',
        template: '<ui-view/>'
      })
      .state('billarchivereports.list', {
        url: '/list',
        templateUrl: '/modules/billarchivereports/client/views/form-billarchivereport.client.view.html',
        controller: 'BillarchivereportsController',
        controllerAs: 'vm',
        resolve: {
          billarchivereportResolve: newBillarchivereport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bill Archive Report'
        }
      });
  }

  getBillarchivereport.$inject = ['$stateParams', 'BillarchivereportsService'];

  function getBillarchivereport($stateParams, BillarchivereportsService) {
    return BillarchivereportsService.get({
      billarchivereport: $stateParams.billarchivereportId
    }).$promise;
  }

  newBillarchivereport.$inject = ['BillarchivereportsService'];

  function newBillarchivereport(BillarchivereportsService) {
    return new BillarchivereportsService();
  }
}());
