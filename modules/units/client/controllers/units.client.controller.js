(function () {
  'use strict';

  // Units controller
  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'CreatedUnitIn', 'UnitsService', 'Notification', '$q'];

  function UnitsController ($scope, $state, $window, Authentication, unitType, UnitsService, Notification, $q) {
    var vm = this;

    vm.authentication = Authentication;
    vm.unitType = unitType;
    // console.log(vm.unitType);
    vm.error = null;
    vm.form = {};

    vm.goBackToList = function() {
      $state.go('unitType.unitList', { findByunitType: vm.unitType._id });
    };

    vm.verifyMultiplier = function() {
      if (vm.multiplierError) {
        if (vm.multiplierWithBaseUnit !== 1 && vm.multiplierWithBaseUnit !== 0 && vm.multiplierWithBaseUnit !== '') {
          vm.multiplierError = false;
        } else {
          vm.multiplierError = true;
        }
      }
    };

    vm.createUnit = function(valid) {
      if (!valid) {
        angular.forEach(vm.unitForm.$error, function (field) {
          angular.forEach(field, function(errorField) {
            errorField.$setTouched();
          });
        });
        return false;
      }
      var defer = $q.defer();
      if (vm.multiplierWithBaseUnit !== 1 && vm.multiplierWithBaseUnit !== 0 && vm.multiplierWithBaseUnit !== '') {
        vm.multiplierError = false;
        vm.disableSave = false;
        var newUnit = new UnitsService({
          name: vm.unitName,
          unitType: vm.unitType._id,
          symbol: vm.symbol,
          multiplierWithBaseUnit: vm.multiplierWithBaseUnit,
          note: vm.note
        });
        newUnit.$save(function(successOnCreate) {
          vm.unitName = '';
          vm.symbol = '';
          vm.multiplierWithBaseUnit = '';
          vm.note = '';

          vm.unitForm.$setPristine();

          vm.unitForm.unitName.$touched = false;
          vm.unitForm.unitName.$valid = false;

          vm.unitForm.symbol.$touched = false;
          vm.unitForm.symbol.$valid = false;

          vm.unitForm.multiplierWithBaseUnit.$touched = false;
          vm.unitForm.multiplierWithBaseUnit.$valid = false;
          vm.disableSave = false;
          Notification.success('Unit ' + successOnCreate.name + ' created successfully');
          focus('unitNameField');
          defer.resolve();
        }, function(errorOnCreate) {
          Notification.error(errorOnCreate.data.message);
          vm.disableSave = false;
          defer.reject();
        });
        return defer.promise;
      } else {
        vm.multiplierError = true;
        defer.reject();
      }
    };
    vm.saveAndBack = function(valid) {
      if (!valid) {
        angular.forEach(vm.unitForm.$error, function (field) {
          angular.forEach(field, function(errorField) {
            errorField.$setTouched();
          });
        });
        return false;
      } else if (valid) {
        vm.createUnit(vm.unitForm.$valid)
        .then(vm.goBackToList);
      } else {
        Notification.error('Something wents wrong!');
      }
    };
  }
}());
