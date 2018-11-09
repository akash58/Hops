(function () {
  'use strict';

  angular
    .module('foodorderreport')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('foodorderreport', {
        abstract: true,
        url: '/foodorderreport',
        template: '<ui-view/>'
      })
      .state('foodorderreport.list', {
        url: '',
        templateUrl: '/modules/foodorderreport/client/views/list-foodorderreport.client.view.html',
        controller: 'FoodorderreportListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Food Order Report List'
        }
      })
      .state('foodorderreport.create', {
        url: '/create',
        templateUrl: '/modules/foodorderreport/client/views/form-foodorderreport.client.view.html',
        controller: 'FoodorderreportController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Food Order Reports'
        }
      })
      .state('foodorderreport.edit', {
        url: '/:foodorderreportId/edit',
        templateUrl: '/modules/foodorderreport/client/views/form-foodorderreport.client.view.html',
        controller: 'FoodorderreportController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit foodorderreport {{ foodorderReportResolve.name }}'
        }
      })
      .state('foodorderreport.view', {
        url: '/:foodorderreportId',
        templateUrl: '/modules/foodorderreport/client/views/view-foodorderreport.client.view.html',
        controller: 'FoodorderreportController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Foodorde rReport {{ foodorderreportResolve.name }}'
        }
      });
  }
}());
