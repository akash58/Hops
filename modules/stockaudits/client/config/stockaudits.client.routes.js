(function () {
  'use strict';

  angular
    .module('stockaudits')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('stockaudits', {
        abstract: true,
        url: '/stockaudits',
        template: '<ui-view/>'
      })
      /* .state('stockaudits.list', {
        url: '',
        templateUrl: '/modules/stockaudits/client/views/list-stockaudits.client.view.html',
        controller: 'StockauditsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Stockaudits List'
        }
      }) */
      .state('stockaudits.create', {
        url: '/create',
        templateUrl: '/modules/stockaudits/client/views/form-stockaudit.client.view.html',
        controller: 'StockauditsController',
        controllerAs: 'vm',
        resolve: {
          stockauditResolve: newStockaudit
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Stockaudits Create'
        }
      })
      .state('stockaudits.edit', {
        url: '/:stockauditId/edit',
        templateUrl: '/modules/stockaudits/client/views/form-stockaudit.client.view.html',
        controller: 'StockauditsController',
        controllerAs: 'vm',
        resolve: {
          stockauditResolve: getStockaudit
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Stockaudit {{ stockauditResolve.name }}'
        }
      })
      .state('stockaudits.view', {
        url: '/:stockauditId',
        templateUrl: '/modules/stockaudits/client/views/view-stockaudit.client.view.html',
        controller: 'StockauditsController',
        controllerAs: 'vm',
        resolve: {
          stockauditResolve: getStockaudit
        },
        data: {
          pageTitle: 'Stockaudit {{ stockauditResolve.name }}'
        }
      });
  }

  getStockaudit.$inject = ['$stateParams', 'StockauditsService'];

  function getStockaudit($stateParams, StockauditsService) {
    return StockauditsService.get({
      stockauditId: $stateParams.stockauditId
    }).$promise;
  }

  newStockaudit.$inject = ['StockauditsService'];

  function newStockaudit(StockauditsService) {
    return new StockauditsService();
  }
}());
