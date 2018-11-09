(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitTypesListController', UnitTypesListController);

  UnitTypesListController.$inject = ['$scope', 'UnitTypesService', '$state', 'Notification', 'UnitsService', '$q', '$location'];

  function UnitTypesListController($scope, UnitTypesService, $state, Notification, UnitsService, $q, $location) {
    var vm = this;
    // vm.unitTypes = angular.copy(unitTypeResolve);
    // console.log(vm.unitTypes);
    vm.searchUnit = '';
    vm.activeUnitType = '';
    vm.index = '';
    vm.limit = 10;
    vm.curPageUnitType = { page: 1 };
    vm.searchUnitType = '';
    vm.maxSize = 5;
    vm.showSearch = false;
    vm.openSearch = openSearch;
    vm.paginationForUnitType = function(searchText) {
      // console.log('searchText');
      vm.getUnitTypeCount = UnitTypesService.get({ unitTypeId: 'count', name: searchText }, function() {
        vm.totalItemsUnitType = vm.getUnitTypeCount;
        vm.unitTypes = UnitTypesService.query({ page: vm.curPageUnitType.page, limit: vm.limit, name: searchText }, function() {
          vm.unitTypesOnPage = angular.copy(vm.unitTypes);
          vm.indexStartUnitType = (vm.curPageUnitType.page - 1) * vm.limit;
          vm.indexEndUnitType = Math.min((vm.curPageUnitType.page) * vm.limit, vm.totalItemsUnitType.count);
        });
      });
    };
    vm.paginationForUnitType(vm.searchUnitType);
    // vm.searchUnitType = '';
    // paginationForUnitType(vm.searchUnitType);
    vm.unitTypeEditer = true;
    vm.goToAddNewUnitType = function() {
      $state.go('unitType.create');
    };
    vm.goToUnitList = function(unitType) {
      $state.go('unitType.unitList', { findByunitType: unitType._id });
    };
    vm.editUnitType = function() {
      vm.unitTypeEditer = false;
    };
    vm.cancelUnitType = function(index) {
      // console.log(vm.unitTypes[index]);
      vm.unitTypeEditer = true;
      vm.unitTypesOnPage[index] = angular.copy(vm.unitTypes[index]);
      vm.activeUnitType = vm.unitTypesOnPage[index];
    };
    vm.unitTypeClicked = function(unitType, index) {
      if (vm.activeUnitType !== '' || vm.activeUnitType._id === unitType._id) {
        vm.activeUnitType = '';
        vm.index = '';
        vm.unitTypeEditer = true;
      } else {
        vm.selectedUnit = unitType.baseUnitId;
        vm.activeUnitType = unitType;
        vm.index = index;
      }
    };
    vm.querySearchUnit = function(searchUnit) {
      var deferred = $q.defer();
      UnitsService.query({ unitName: searchUnit }, function(units) {
        deferred.resolve(units);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    vm.updateUnitType = function(unitType, index) {
      unitType.baseUnitId = vm.selectedUnit._id;
      unitType.baseUnitName = vm.selectedUnit.name;
      unitType.baseUnitSymbol = vm.selectedUnit.symbol;
      unitType.$update(function(updatedUnitType) {
        Notification.success('Unit Type ' + updatedUnitType.name + ' successfully!');
        vm.unitTypes[index] = updatedUnitType;
        unitType.baseUnitId = vm.selectedUnit;
        vm.cancelUnitType(index);
      }, function(errorOnUpdate) {
        Notification.error(errorOnUpdate);
      });
    };
    /*
    * show search
    */
    function openSearch() {
      vm.showSearch = true;
      focus('search');
    }
  }
}());
