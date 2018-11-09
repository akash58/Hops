(function () {
  'use strict';

  angular
    .module('attendants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('attendants', {
        abstract: true,
        url: '/attendants',
        template: '<ui-view/>'
      })
      .state('attendants.list', {
        url: '',
        templateUrl: '/modules/attendants/client/views/list-attendants.client.view.html',
        controller: 'AttendantsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Attendants List'
        }
      })
      .state('attendants.create', {
        url: '/createEmailAttendats',
        templateUrl: '/modules/attendants/client/views/form-attendant.client.view.html',
        controller: 'AttendantsController',
        controllerAs: 'vm',
        resolve: {
          attendantResolve: newAttendant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Attendants Create'
        }
      })
      .state('attendants.verify', {
        url: '/verify/:token',
        templateUrl: '/modules/attendants/client/views/create-attendant.client.view.html',
        controller: 'AttendantsController',
        controllerAs: 'vm',
        resolve: {
          attendantResolve: newAttendant
        },
        data: {
          roles: ['guest'],
          pageTitle: 'User Create Attendants'
        }
      })
      .state('attendants.edit', {
        url: '/:attendantId/edit',
        templateUrl: '/modules/attendants/client/views/form-attendant.client.view.html',
        controller: 'AttendantsController',
        controllerAs: 'vm',
        resolve: {
          attendantResolve: getAttendant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Attendant {{ attendantResolve.name }}'
        }
      })
      .state('attendants.view', {
        url: '/:attendantId',
        templateUrl: '/modules/attendants/client/views/view-attendant.client.view.html',
        controller: 'AttendantsController',
        controllerAs: 'vm',
        resolve: {
          attendantResolve: getAttendant
        },
        data: {
          pageTitle: 'Attendant {{ attendantResolve.name }}'
        }
      });
  }

  getAttendant.$inject = ['$stateParams', 'AttendantsService'];

  function getAttendant($stateParams, AttendantsService) {
    return AttendantsService.get({
      attendantId: $stateParams.attendantId
    }).$promise;
  }

  newAttendant.$inject = ['AttendantsService'];

  function newAttendant(AttendantsService) {
    return new AttendantsService();
  }
}());
