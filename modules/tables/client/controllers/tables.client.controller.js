(function () {
  'use strict';

  // Tables controller
  angular
    .module('tables')
    .controller('TablesController', TablesController);

  TablesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'tableResolve', 'TablesService', 'Notification', 'UsersService', '$q'];

  function TablesController ($scope, $state, $window, Authentication, table, TablesService, Notification, UsersService, $q) {
    var vm = this;

    vm.authentication = Authentication;
    vm.table = table;
    vm.error = null;
    vm.form = {};
    vm.foodOnly = true;
    vm.searchTableByNumber = '';
    vm.searchAttendant = '';
    vm.tableEditer = false;
    paginationForTables(vm.searchTableByNumber);
    vm.createTable = function() {
      if (vm.currentAttendant) {
        vm.currentAttendentRef = vm.currentAttendant._id;
      } else {
        vm.currentAttendentRef;
      }
      var newTable = new TablesService({
        tableNumber: vm.tableNumber,
        tableSize: vm.tableSize,
        foodOnly: vm.foodOnly,
        currentAttendant: vm.currentAttendentRef
      });
      newTable.$save(function(createdTable) {
        $scope.tableForm.$setPristine();
        $scope.tableForm.$setUntouched();
        /* $scope.tableForm.tableNumber.$touched = false;
        $scope.tableForm.tableNumber.$valid = false;
        $scope.tableForm.tableSize.$touched = false;
        $scope.tableForm.tableSize.$valid = false;
        $scope.tableForm.currentAttendant.$touched = false;
        $scope.tableForm.currentAttendant.$valid = false;*/
        Notification.success('New Table is added with a Number ' + createdTable.tableNumber + ' for' + createdTable.tableSize);
        paginationForTables(vm.searchTableByNumber);
        vm.tableNumber = '';
        vm.tableSize = '';
        vm.foodOnly = true;
        vm.currentAttendant = '';
      }, function(errorOnCreation) {
        Notification.error(errorOnCreation);
      });
    };

    vm.updateTable = function(tableFoUpdate) {
      tableFoUpdate.tableNumber = vm.edit.tableNumber;
      tableFoUpdate.tableSize = vm.edit.tableSize;
      tableFoUpdate.currentAttendant = vm.edit.currentAttendant;
      tableFoUpdate.foodOnly = vm.edit.foodOnly;
      tableFoUpdate.$update(function(updatedTable) {
      // Notification.success('Table Number ' + updatedTable.tableNumber + ' for' + updatedTable.tableSize + 'is Updated Successfully!');
        Notification.success('Table Updated Successfully');
        paginationForTables(vm.searchTableByNumber);
        vm.tableEditer = false;
      }, function(errorOnUpdate) {
        Notification.error(errorOnUpdate);
      });
    };

    vm.editTable = function(table) {
      vm.tableEditer = true;
    };

    vm.tableCardClicked = function(table) {
      if (vm.activeTable === table._id) {
        vm.activeTable = '';
        vm.tableEditer = false;
      } else {
        vm.activeTable = table._id;
        vm.edit = { tableNumber: table.tableNumber, tableSize: table.tableSize, foodOnly: table.foodOnly, currentAttendant: table.currentAttendant };
      }
    };
    vm.canselTableEdit = function(table) {
      vm.tableEditer = false;
    };
    vm.deleteTable = function(table) {
      if ($window.confirm('Are You sure you want to delete Table Number: ' + table.tableNumber + ' ?')) {
        table.active = false;
        table.$update(function(tableDeleted) {
          Notification.success('Table Number ' + tableDeleted.tableNumber + 'is Deleted Successfully !');
          paginationForTables(vm.searchTableByNumber);
        }, function(errorOnTableDelete) {
          Notification.error(errorOnTableDelete);
        });
      }
    };
    vm.querySearchForAttendent = function(searchAttendant) {
      var deferred = $q.defer();
      UsersService.query({ tenant: searchAttendant, search: vm.searchAttendant }, function(attendant) {
          // console.log(attendant);
        deferred.resolve(attendant);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    // vm.selectedAttendentChangeOnEdit = function(selectedAttendent) {
    //   console.log(selectedAttendent);
    // };

    function paginationForTables(searchTable) {
      TablesService.query(/* { tableNumber: searchTable }, */ function(listOfTables) {
        vm.tables = listOfTables;
       // console.log(vm.tables);
      }, function(error) {
        Notification.error(error);

      });
    }
  }
}());
