(function () {
  'use strict';

  angular
    .module('billdetails')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('billdetails', {
        abstract: true,
        url: '/billdetails',
        template: '<ui-view/>'
      })
      .state('billdetails.list', {
        url: '',
        templateUrl: '/modules/billdetails/client/views/list-billdetails.client.view.html',
        controller: 'BilldetailsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Billdetails List'
        }
      })
      .state('billdetails.create', {
        url: '/create',
        templateUrl: '/modules/billdetails/client/views/form-billdetail.client.view.html',
        controller: 'BilldetailsController',
        controllerAs: 'vm',
        resolve: {
          billdetailResolve: newBilldetail
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Billdetails Create'
        }
      })
      .state('billdetails.edit', {
        url: '/:billdetailId/edit',
        templateUrl: '/modules/billdetails/client/views/form-billdetail.client.view.html',
        controller: 'BilldetailsController',
        controllerAs: 'vm',
        resolve: {
          billdetailResolve: getBilldetail
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Billdetail {{ billdetailResolve.name }}'
        }
      })
      .state('billdetails.view', {
        url: '/:billdetailId',
        templateUrl: '/modules/billdetails/client/views/view-billdetail.client.view.html',
        controller: 'BilldetailsController',
        controllerAs: 'vm',
        resolve: {
          billdetailResolve: getBilldetail
        },
        data: {
          pageTitle: 'Billdetail {{ billdetailResolve.name }}'
        }
      });
  }

  getBilldetail.$inject = ['$stateParams', 'BillsService'];

  function getBilldetail($stateParams, BillsService) {
    return BillsService.get({
      billdetailId: $stateParams.billdetailId
    }).$promise;
  }

  newBilldetail.$inject = ['BillsService'];

  function newBilldetail(BillsService) {
    return new BillsService();
  }
}());
