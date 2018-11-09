(function () {
  'use strict';

  angular
    .module('memberships')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('memberships', {
        abstract: true,
        url: '/memberships',
        template: '<ui-view/>'
      })
      .state('memberships.list', {
        url: '',
        templateUrl: '/modules/memberships/client/views/list-memberships.client.view.html',
        controller: 'MembershipsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Memberships List'
        }
      })
      .state('memberships.create', {
        url: '/create',
        templateUrl: '/modules/memberships/client/views/form-membership.client.view.html',
        controller: 'MembershipsController',
        controllerAs: 'vm',
        resolve: {
          membershipResolve: newMembership
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Memberships Create'
        }
      })
      .state('memberships.edit', {
        url: '/:membershipId/edit',
        templateUrl: '/modules/memberships/client/views/form-membership.client.view.html',
        controller: 'MembershipsController',
        controllerAs: 'vm',
        resolve: {
          membershipResolve: getMembership
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Membership {{ membershipResolve.name }}'
        }
      })
      .state('memberships.view', {
        url: '/:membershipId',
        templateUrl: '/modules/memberships/client/views/view-membership.client.view.html',
        controller: 'MembershipsController',
        controllerAs: 'vm',
        resolve: {
          membershipResolve: getMembership
        },
        data: {
          pageTitle: 'Membership {{ membershipResolve.name }}'
        }
      });
  }

  getMembership.$inject = ['$stateParams', 'MembershipsService'];

  function getMembership($stateParams, MembershipsService) {
    return MembershipsService.get({
      membershipId: $stateParams.membershipId
    }).$promise;
  }

  newMembership.$inject = ['MembershipsService'];

  function newMembership(MembershipsService) {
    return new MembershipsService();
  }
}());
