(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsListController', UnitsListController);

  UnitsListController.$inject = ['$scope', 'UnitsService', '$stateParams', '$state', 'unitResolve', 'Notification', '$window', 'CreatedUnitIn', '$mdDialog', '$q', '$location'];

  function UnitsListController($scope, UnitsService, $stateParams, $state, unitResolve, Notification, $window, CreatedUnitIn, $mdDialog, $q, $location) {
    var vm = this;
    vm.parentUnitType = CreatedUnitIn;
    // vm.units = angular.copy(unitResolve);
    vm.unitEditer = true;
    vm.limit = 10;
    vm.activeunit = '';
    vm.index = '';
    vm.curPageUnit = { page: 1 };
    vm.searchTextUnit = '';
    vm.maxSize = 5;
    vm.showSearch = false;
    vm.openSearch = openSearch;
    vm.paginationForUnits = function(searchText) {
      // console.log('searchText');
      vm.getUnitCount = UnitsService.get({ unitId: 'count', name: searchText, findByunitType: vm.parentUnitType._id }, function(res) {
        vm.totalItemsUnit = vm.getUnitCount;
        vm.unitsOnPage = UnitsService.query({ page: vm.curPageUnit.page, limit: vm.limit, name: searchText, findByunitType: vm.parentUnitType._id }, function() {
          vm.units = angular.copy(vm.unitsOnPage);
          vm.indexStartUnit = (vm.curPageUnit.page - 1) * vm.limit;
          vm.indexEndUnit = Math.min((vm.curPageUnit.page) * vm.limit, vm.totalItemsUnit.count);
        });
      });
    };
    vm.paginationForUnits(vm.searchTextUnit);
    vm.unitClicked = function(unit, index) {
      if (vm.activeunit !== '' || vm.activeunit._id === unit._id) {
        vm.activeunit = '';
        vm.unitEditer = true;
        vm.index = '';
      } else {
        vm.activeunit = unit;
        vm.index = index;
        focus('nameField');
      }
    };
    vm.editUnit = function() {
      vm.unitEditer = false;
    };
    vm.cancelEdit = function(index) {
      vm.unitEditer = true;
      vm.units[index] = angular.copy(vm.unitsOnPage[index]);
      vm.activeunit = vm.units[index];
    };
    vm.updateUnit = function(unit, index) {
      unit.$update(function(updatedUnit) {
        Notification.success('Unit ' + updatedUnit.name + ' Updated successfully!');
        vm.unitsOnPage[index] = updatedUnit;
        vm.activeunit = updatedUnit;
        vm.cancelEdit(index);
      }, function(errorOnUpdate) {
        Notification.error(errorOnUpdate);
      });
    };
    vm.deleteUnit = function(unit, ev, callback) {
      // if ($window.confirm('Are you really want to delete Unit ' + unit.name + ' ?')) {
      //   unit.active = false;
      //   unit.$update(function(deletedUnit) {
      //     Notification.success('Unit ' + deletedUnit.name + ' Deleted');
      //   }, function(errorOndelete) {
      //     Notification.error(errorOndelete);
      //   });
      // }
      var confirm = $mdDialog.confirm({ onComplete: function afterShowAnimation() {
        var $dialog = angular.element(document.querySelector('md-dialog'));
        var $actionsSection = $dialog.find('md-dialog-actions');
        var $cancelButton = $actionsSection.children()[0];
        var $confirmButton = $actionsSection.children()[1];
        angular.element($confirmButton).removeClass('md-focused');
        angular.element($cancelButton).addClass('md-focused');
        $cancelButton.focus();
      } })
        .title('Please Confirm!')
        .textContent('Are you sure you want to delete ' + unit.name + ' unit ?')
        .ariaLabel('Are you sure you want to delete ' + unit.name + ' unit ?')
        .targetEvent(ev)
        .ok('Yes! Delete')
        .cancel('No! Don\'t Delete');

      $mdDialog.show(confirm).then(function() {
        // console.log(unit);
        unit.active = false;
        unit.$update(function (res) {
          Notification.success('Deleted!');
          if (callback && typeof callback === 'function') callback();
          vm.paginationForUnits(vm.searchTextUnit);
        }, function (err) {
          Notification.error(err);
        });
      }, function() {
        Notification.warning('You have cancelled the Delete!');
      });
    };
    vm.goToAddNewUnit = function() {
      $state.go('unitType.unitCreate', { findByunitType: $stateParams.findByunitType });
    };
    vm.goBackToUnitTypeList = function() {
      $state.go('unitType.list');
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
