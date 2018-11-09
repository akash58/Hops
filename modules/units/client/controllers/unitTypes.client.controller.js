(function () {
  'use strict';

  // Units controller
  angular
    .module('units')
    .controller('UnitTypesController', UnitTypesController);

  UnitTypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'unitTypeResolve', 'UnitTypesService', 'Notification', 'UnitsService', '$q'];

  function UnitTypesController ($scope, $state, $window, Authentication, unitType, UnitTypesService, Notification, UnitsService, $q) {
    var vm = this;
    vm.authentication = Authentication;
    vm.unitType = unitType;
    vm.error = null;
    vm.form = {};
    vm.goBackToList = function() {
      $state.go('unitType.list');
    };

    vm.saveUnitType = function(valid) {
      if (!valid) {
        angular.forEach(vm.form.unitTypeForm.$error, function (field) {
          angular.forEach(field, function(errorField) {
            errorField.$setTouched();
          });
        });
        return false;
      }
      var defer = $q.defer();
      vm.disableSave = true;
      var unitType = new UnitTypesService({
        name: vm.unitTypeName,
        baseUnitName: vm.baseUnitName,
        baseUnitSymbol: vm.baseUnitSymbol,
        note: vm.note
      });
      unitType.$save(function(response) {
        vm.unitTypeName = '';
        vm.baseUnitName = '';
        vm.baseUnitSymbol = '';
        vm.note = '';

        vm.form.unitTypeForm.$setPristine();

        vm.form.unitTypeForm.baseUnitName.$touched = false;
        vm.form.unitTypeForm.baseUnitName.$valid = false;

        vm.form.unitTypeForm.unitTypeName.$touched = false;
        vm.form.unitTypeForm.unitTypeName.$valid = false;


        vm.form.unitTypeForm.baseUnitSymbol.$touched = false;
        vm.form.unitTypeForm.baseUnitSymbol.$valid = false;

        vm.disableSave = false;
        Notification.success('Unit Type ' + response.name + ' is created successfully!');
        focus('unitTypeNameField');
        defer.resolve();
      }, function(errorResponse) {
        Notification.error(errorResponse.data.message);
        vm.disableSave = false;
        defer.reject();
      });
      return defer.promise;
    };
    vm.saveAndBack = function(valid) {
      if (!valid) {
        angular.forEach(vm.form.unitTypeForm.$error, function (field) {
          angular.forEach(field, function(errorField) {
            errorField.$setTouched();
          });
        });
        return false;
      } else if (valid) {
        vm.saveUnitType(vm.form.unitTypeForm.$valid)
        .then(vm.goBackToList);
      } else {
        Notification.error('Something wents wrong!');
      }
    };
  }
}());
