(function () {
  'use strict';

  angular
    .module('systemparameters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('systemparameters', {
        abstract: true,
        url: '/systemparameters',
        template: '<ui-view/>'
      })
      .state('systemparameters.list', {
        url: '',
        templateUrl: '/modules/systemparameters/client/views/list-systemparameters.client.view.html',
        controller: 'SystemparametersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Systemparameters List'
        }
      })
      .state('systemparameters.create', {
        url: '/create',
        templateUrl: '/modules/systemparameters/client/views/form-systemparameter.client.view.html',
        controller: 'SystemparametersController',
        controllerAs: 'vm',
        resolve: {
          systemparameterResolve: newSystemparameter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Systemparameters Create'
        }
      })
      .state('systemparameters.edit', {
        url: '/:systemparameterId/edit',
        templateUrl: '/modules/systemparameters/client/views/form-systemparameter.client.view.html',
        controller: 'SystemparametersController',
        controllerAs: 'vm',
        resolve: {
          systemparameterResolve: getSystemparameter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Systemparameter {{ systemparameterResolve.name }}'
        }
      })
      .state('systemparameters.view', {
        url: '/:systemparameterId',
        templateUrl: '/modules/systemparameters/client/views/view-systemparameter.client.view.html',
        controller: 'SystemparametersController',
        controllerAs: 'vm',
        resolve: {
          systemparameterResolve: getSystemparameter
        },
        data: {
          pageTitle: 'Systemparameter {{ systemparameterResolve.name }}'
        }
      });
  }

  getSystemparameter.$inject = ['$stateParams', 'SystemparametersService'];

  function getSystemparameter($stateParams, SystemparametersService) {
    return SystemparametersService.get({
      systemparameterId: $stateParams.systemparameterId
    }).$promise;
  }

  newSystemparameter.$inject = ['SystemparametersService'];

  function newSystemparameter(SystemparametersService) {
    return new SystemparametersService();
  }
}());
