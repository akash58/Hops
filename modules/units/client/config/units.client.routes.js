(function () {
  'use strict';

  angular
    .module('units')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('unitType', {
        abstract: true,
        url: '/unitType',
        template: '<ui-view/>'
      })
      .state('unitType.list', {
        url: '',
        templateUrl: '/modules/units/client/views/list-unitTypes.client.view.html',
        controller: 'UnitTypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Unit Type List'
        }
      })
      .state('unitType.create', {
        url: '/create',
        templateUrl: '/modules/units/client/views/form-unitType.client.view.html',
        controller: 'UnitTypesController',
        controllerAs: 'vm',
        resolve: {
          unitTypeResolve: newUnitType
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Unit Type Create'
        }
      })
      .state('unitType.unitCreate', {
        url: '/:findByunitType/create',
        templateUrl: '/modules/units/client/views/form-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          CreatedUnitIn: newUnitInType
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Units Create in {{CreatedUnitIn.name}}'
        }
      })
      .state('unitType.unitList', {
        url: '/:findByunitType',
        templateUrl: '/modules/units/client/views/list-units.client.view.html',
        controller: 'UnitsListController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: getUnit,
          CreatedUnitIn: newUnitInType
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Units list of {{CreatedUnitIn.name}}'
        }
      });
  }

  getUnit.$inject = ['$stateParams', 'UnitsService'];

  function getUnit($stateParams, UnitsService) {
    return UnitsService.query({
      findByunitType: $stateParams.findByunitType
    }).$promise;
  }

  newUnit.$inject = ['UnitsService'];

  function newUnit(UnitsService) {
    return new UnitsService();
  }
  getUnitType.$inject = ['$stateParams', 'UnitTypesService'];

  function getUnitType($stateParams, UnitTypesService) {
    return UnitTypesService.query({
      unitType: $stateParams.unitTypeId
    }).$promise;
  }

  newUnitInType.$inject = ['$stateParams', 'UnitTypesService'];

  function newUnitInType($stateParams, UnitTypesService) {
    return UnitTypesService.get({
      unitTypeId: $stateParams.findByunitType
    }).$promise;
  }

  newUnitType.$inject = ['UnitTypesService'];

  function newUnitType(UnitTypesService) {
    return new UnitTypesService();
  }
}());
