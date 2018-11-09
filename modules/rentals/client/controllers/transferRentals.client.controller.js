(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('TransferRentalController', TransferRentalController);

  TransferRentalController.$inject = ['$scope', '$window', 'Authentication', 'TablesService', '$mdDialog', '$mdToast', 'tableId', '$q', 'RentalsService', 'rental', 'FoodTypeService', 'FoodsService', 'foodOnly', 'UsersService', 'Serials'];

  function TransferRentalController($scope, $window, Authentication, TablesService, $mdDialog, $mdToast, tableId, $q, RentalsService, rental, FoodTypeService, FoodsService, foodOnly, UsersService, Serials) {
    var vm = this;

    vm.authentication = Authentication;
    $scope.initialize = function() {
      $scope.rental = rental;
      $scope.tables = TablesService.query(function (response) {
        $scope.tableId = tableId;
        // console.log(tableId);
        $scope.users = UsersService.query({ tenant: vm.authentication.user.tenants[0]._id }, function() {
          // $scope.serials = serials;
          $scope.rentTransfer = { table: '', attendantDisplayName: '', displaySerial: '', attendant: '', serial: '' };
          $scope.updateTableDropDown(function() { $scope.updateTableAttendantSerialInTransferModal(); });
          if ($scope.rentTransfer.table === '') {
            $scope.disableTransferButton = true;
          }
          $scope.foodOnly = foodOnly;
          if (!$scope.foodOnly) {
            $scope.serials = Serials.query();
          }
        }, function (err) {
          $scope.err = err;
        });
      }, function (err) {
        $scope.err = err;
      });

      // $scope.updateTableAttendantSerialInTransferModal();
    };

    $scope.updateTableDropDown = function(callback) {
      for (var t = 0; t < $scope.tables.length; t++) {
        $scope.tables[t].tablecouldNotTransfer = true;
      }
      for (var a = 0; a < $scope.tables.length; a++) {
        if ($scope.tables[a]._id === $scope.tableId || $scope.tables[a].status === 'unavailable') {
          $scope.tables[a].tablecouldNotTransfer = false;
        }
      }
      for (var b = 0; b < $scope.tables.length; b++) {
        if ($scope.tables[b].tablecouldNotTransfer) {
          $scope.rentTransfer.table = $scope.tables[b]._id;
          break;
        }
      }

      if (callback) callback();
    };

    $scope.updateTableAttendantSerialInTransferModal = function() {

      for (var i = 0; i < $scope.tables.length; i++)
        if ($scope.tables[i]._id === $scope.rentTransfer.table) {
          if ($scope.tables[i].currentAttendant) {
            $scope.rentTransfer.attendantDisplayName = $scope.tables[i].currentAttendant.displayName;
            $scope.rentTransfer.attendant = $scope.tables[i].currentAttendant._id;
            $scope.tableNotInitialize = false;
            $scope.disableTransferButton = false;
          } else {
            $scope.rentTransfer.attendant = '';
            $scope.rentTransfer.attendantDisplayName = '';
            $scope.tableNotInitialize = true;
            $scope.disableTransferButton = true;
          }
          // $scope.test = $scope.tables[i].serial;
          if ($scope.tables[i].serial) {
            $scope.rentTransfer.serial = $scope.tables[i].serial._id;
            $scope.rentTransfer.displaySerial = $scope.tables[i].serial.serialNumber + ' - ' + $scope.tables[i].serial.product.productNumber;
          } else {
            $scope.rentTransfer.serial = '';
            $scope.rentTransfer.displaySerial = '';
          }
          break;
        }
      if (!foodOnly) {
        $scope.appendSerials();
      }
    };

    $scope.appendSerials = function() {

      for (var k = 0; k < $scope.serials.length; k++) {
        $scope.serials[k].displaySerial = $scope.serials[k].serialNumber + ' - ' + $scope.serials[k].product.productNumber;
        $scope.serials[k].alreadyRenting = false;
      }
      for (var j = 0; j < $scope.tables.length; j++) {
        if ($scope.tables[j]._id !== $scope.rentTransfer.attendant) {
          if ($scope.tables[j].serial) {
            for (var i = 0; i < $scope.serials.length; i++) {
              if ($scope.serials[i]._id === $scope.tables[j].serial._id) {
                $scope.serials[i].alreadyRenting = true;
                break;
              }
            }
          }
        }
      }
    };

    $scope.enableTransferButton = function() {
      if ($scope.rentTransfer.attendant === '' && $scope.rentTransfer.serial === '') {
        $scope.disableTransferButton = true;
      } else if ($scope.rentTransfer.attendant && $scope.rentTransfer.serial) {
        $scope.disableTransferButton = false;
      }
    };

    $scope.focusRental = function() {
      $scope.errorfoo = false;
    };

    $scope.alertTableExchange = function(ev) {

      for (var c = 0; c < $scope.tables.length; c++) {
        if ($scope.tables[c]._id === $scope.rentTransfer.table) {
          if ($scope.tables[c].status === 'available') {
            $scope.transferRentalClick();
          } else {
            if (!$scope.foodOnly) {
              if ($scope.tables[c].serial.product.category === $scope.rental.serial.product.category._id) {
                // $scope.testtable=$scope.tables[c].serial.product.category;
                $scope.transferRentalClick();
              } else {
                var d = $window.confirm('Are You Sure You Want To Change Category!');
                if (d === true) {
                  $scope.transferRentalClick();
                }
              }
            } else {
              var a = $window.confirm('Table Allready have customers!\n Still you want to Transfer.');
              if (a === true) {
                $scope.transferRentalClick();
              }
              // var confirm = $mdDialog.confirm()
              //   .title('Table Allready have customers!')
              //   .textContent('Still you like to Transfer.')
              //   .ariaLabel('Transfer rental')
              //   .targetEvent(ev)
              //   .ok('Transfer')
              //   .cancel('Cancel');

              // $mdDialog.show(confirm).then(function() {
              //   $scope.status = 'You transfer rental';
              //   $scope.transferRentalClick();
              // }, function() {
              //   $scope.status = 'you cancel rental transfer';
              //   $mdDialog.cancel();
              // });
            }
          }
        }
      }
      // $scope.testrental=$scope.rental.serial.product.category;
    };

    $scope.transferRentalClick = function () {
      // $scope.testWorking=$scope.rental;
      // var result = {};
      // result.addedTableForTransfer = $scope.rentTransfer;
      // result.rental = $scope.rental;
      RentalsService.query(function(rentals) {
        for (var i = 0; i < rentals.length; i++) {
          if (rentals[i]._id === $scope.rental._id) {
            if (rentals[i].activeRental !== true) {
              $window.alert('Please Refresh The Page');
            } else {
              $scope.transferRentalWithinTable();
            }
            break;
          }
        }
      }, function(err) {
        $scope.err = err;
      });
      // $modalInstance.close(result);
    };

    $scope.transferRentalWithinTable = function () {
      var transferRentalSend = new RentalsService({
        _id: $scope.rental._id,
        activeRental: false,
        rentalEnd: Date.now()
      });
      // console.log(transferRentalSend);
      transferRentalSend.$update(function() {
        $scope.updatedExtendRentalSuccessfully = true;
        $scope.addTransferRental();
      }, function(errorResponse) {
        $scope.errorUpdateExtendRental = errorResponse.data.message;
      });
    };

    $scope.addTransferRental = function() {

      var saveTransferRental = new RentalsService({
        table: $scope.rentTransfer.table,
        attendant: $scope.rentTransfer.attendant,
        customer: $scope.rental.customer._id,
        activeRental: true,
        renewalRental: $scope.rental._id
      });
      if (!foodOnly) {
        saveTransferRental.serial = $scope.rentTransfer.serial;
        saveTransferRental.rentalPeriod = $scope.rental.rentalPeriod;
        saveTransferRental.rentalStart = $scope.rental.rentalStart;
        saveTransferRental.renewalRentalStart = Date.now();
        saveTransferRental.rentalEnd = $scope.rental.rentalEnd;
        saveTransferRental.deposit = $scope.rental.deposit;
        saveTransferRental.description = $scope.rental.description;
      }
      // $scope.testWorking=tableForTransfer;
      saveTransferRental.$save(function() {
        $scope.saveExtendRenewalRentalSuccessfully = true;
        for (var r = 0; r < $scope.tables.length; r++) {
          if ($scope.tables[r]._id === $scope.rentTransfer.table) {
            if ($scope.tables[r].status === 'available') {
              $scope.updateTableStatusToBusyForTransfer();
            }
          }
        }
        $mdDialog.hide($scope.rentTransfer.table);
        // $scope.tables = Tables.query( function(){
        //   $scope.setTable(tableForTransfer.table,function(){
        //     $scope.updateTableAttendantSerial();

        //   });
        // });
        // $scope.tableSerialEditing = false;
        // // $scope.initialize();
        // $scope.queryRental(function(){
        //   $scope.queryCustomer();
        // });
      }, function(errorResponse) {
        $scope.errorExtendRenewalRental = errorResponse.data.message;
      });
    };

    $scope.updateTableStatusToBusyForTransfer = function() {
      var sendTableStatusBusy = new TablesService({
        _id: $scope.rentTransfer.table,
        status: 'busy',
        currentAttendant: $scope.rentTransfer.attendant
        // created: Date.now()
      });
      if (!foodOnly) {
        sendTableStatusBusy.serial = $scope.rentTransfer.serial;
      }
      sendTableStatusBusy.$update(function() {
        $scope.tableUpdatedSuccessfully = true;
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.cancel = function () {
      // $modalInstance.dismiss('cancel');
      $mdDialog.cancel();
    };
  }
}());
