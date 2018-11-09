(function () {
  'use strict';

  angular
    .module('purchaseorders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('purchaseorders', {
        abstract: true,
        url: '/purchaseorders',
        template: '<ui-view/>'
      })
      /* .state('purchaseorders.list', {
        url: '',
        templateUrl: '/modules/purchaseorders/client/views/list-purchaseorders.client.view.html',
        controller: 'PurchaseordersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Purchase Orders List'
        }
      }) */
      .state('purchaseorders.create', {
        url: '/create',
        templateUrl: '/modules/purchaseorders/client/views/form-purchaseorder.client.view.html',
        controller: 'PurchaseordersController',
        controllerAs: 'vm',
        resolve: {
          purchaseorderResolve: newPurchaseorder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Purchase Orders'
        }
      })
      .state('purchaseorders.edit', {
        url: '/:purchaseorderId/edit',
        templateUrl: '/modules/purchaseorders/client/views/form-purchaseorder.client.view.html',
        controller: 'PurchaseordersController',
        controllerAs: 'vm',
        resolve: {
          purchaseorderResolve: getPurchaseorder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Purchaseorder {{ purchaseorderResolve.name }}'
        }
      });
  }

  getPurchaseorder.$inject = ['$stateParams', 'PurchaseordersService'];

  function getPurchaseorder($stateParams, PurchaseordersService) {
    return PurchaseordersService.get({
      purchaseorsderd: $stateParams.purchaseorsderId
    }).$promise;
  }

  newPurchaseorder.$inject = ['PurchaseordersService'];

  function newPurchaseorder(PurchaseordersService) {
    return new PurchaseordersService();
  }
}());
