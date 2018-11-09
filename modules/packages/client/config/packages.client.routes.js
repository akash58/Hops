(function () {
  'use strict';

  angular
    .module('packages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('packages', {
        abstract: true,
        url: '/packages',
        template: '<ui-view/>'
      })
      .state('packages.list', {
        url: '',
        templateUrl: '/modules/packages/client/views/list-packages.client.view.html',
        controller: 'PackagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Packages List'
        }
      })
      .state('packages.create', {
        url: '/create',
        templateUrl: '/modules/packages/client/views/form-package.client.view.html',
        controller: 'PackagesController',
        controllerAs: 'vm',
        resolve: {
          packageResolve: newPackage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Packages Create'
        }
      })
      .state('packages.edit', {
        url: '/:packageId/edit',
        templateUrl: '/modules/packages/client/views/form-package.client.view.html',
        controller: 'PackagesController',
        controllerAs: 'vm',
        resolve: {
          packageResolve: getPackage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Package {{ packageResolve.name }}'
        }
      })
      .state('packages.view', {
        url: '/:packageId',
        templateUrl: '/modules/packages/client/views/view-package.client.view.html',
        controller: 'PackagesController',
        controllerAs: 'vm',
        resolve: {
          packageResolve: getPackage
        },
        data: {
          pageTitle: 'Package {{ packageResolve.name }}'
        }
      });
  }

  getPackage.$inject = ['$stateParams', 'PackagesService'];

  function getPackage($stateParams, PackagesService) {
    return PackagesService.get({
      packageId: $stateParams.packageId
    }).$promise;
  }

  newPackage.$inject = ['PackagesService'];

  function newPackage(PackagesService) {
    return new PackagesService();
  }
}());
