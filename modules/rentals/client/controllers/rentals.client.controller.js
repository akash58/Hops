(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('RentalsController', RentalsController);

  RentalsController.$inject = ['$scope', /* 'tableResolve', */ 'Authentication', 'TablesService', '$mdDialog', '$mdToast', 'UsersService', 'RentalsService', 'filterFilter', '$stateParams', 'Serials', '$q', '$window', 'billCalcService', 'PackageorderService', 'Notification'];

  function RentalsController($scope, /* tableResolve, */ Authentication, TablesService, $mdDialog, $mdToast, UsersService, RentalsService, filterFilter, $stateParams, Serials, $q, $window, billCalcService, PackageorderService, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    /* *************************
    *
    */
    // $scope.rentals = [{
    //   _id: 4543543
    // }, {
    //   _id: 87584
    // }];
// <<<<<<< HEAD
    // vm.users = UsersService.query({ tenant: vm.authentication.user.tenants[0]._id });
    // $scope.loadUsers = function() {
    //   // console.log('user called');
    //   vm.users = UsersService.query({ tenant: vm.authentication.user.tenants[0]._id });
    // };
    // $scope.serials = Serials.query(function() {
    //   $scope.appendSerials();
    // });

    // $scope.tables = TablesService.query(function (response) {

    //   if ($stateParams.tableId) {
    //     for (var i = 0; i < response.length; i++) {
    //       if (response[i]._id === $stateParams.tableId) {
    //         $scope.rent.table = response[i]._id;
    //         $scope.rent.foodOnly = response[i].foodOnly;
    //         $scope.rent.attendant = response[i].currentAttendant._id;
    //         if (!$scope.rent.foodOnly) {
    //           if (response[i].serial) {
    //             response[i].serial.displaySerial = response[i].serial.serialNumber + '-' + response[i].serial.product.productNumber;
    //             $scope.rent.serialSelectedItem = response[i].serial;
    //             $scope.rent.serial = response[i].serial._id;
    //           }
    //         }
    //         break;
    //       }
    //     }
    //   } else {
    //     $scope.rent.table = response[0]._id;
    //     $scope.rent.foodOnly = response[0].foodOnly;
    //     $scope.rent.attendant = response[0].currentAttendant._id;
    //     if (!$scope.rent.foodOnly) {
    //       if (response[0].serial) {
    //         response[0].serial.displaySerial = response[0].serial.serialNumber + '-' + response[0].serial.product.productNumber;
    //         $scope.rent.serialSelectedItem = response[0].serial;
    //         $scope.rent.serial = response[0].serial._id;
    //       }
    //     }
    //   }
    //   $scope.getRentals();
    // }, function (err) {
    //   $scope.err = err;
    // });
// =======
// >>>>>>> 165ce42a4e08b975326139e857163f2ad7453a64

    // $scope.initialize = function(){

    //   // $scope.getRentals = "";
    // };

    $scope.rent = {
      /* table: '',*/
      currentTableObj: '',
      // Serial
      serial: '',
      serialSelectedItem: '',
      serialSearchText: '',
      // Attendant
      // attendant: '',
      attendantSelectedItem: '',
      attendantSearchText: '',
      // attendantDisplayName: '',
      // Rental
      rentalPeriod: '',
      rentalStart: '',
      rentalEnd: '',
      deposit: '',
      description: '',
      /* customer:'', */
      customerId: '',
      package: '',
      extendTime: '',
      expectedTime: '',
      foodOnly: true,
      selected: false,
      selectedAll: false,
      isVisible: true
      // changeFoodOnly: ''
      // isVisible: true;
    };


    $scope.button = true;

    $scope.loadUsers = function(callback) {
      vm.users = UsersService.query({ tenant: vm.authentication.user.tenants[0]._id });
      if (callback && typeof callback === 'function') callback();
    };

    $scope.loadUsers();

    $scope.serials = Serials.query(function() {
      $scope.appendSerials();
    }); // 20171007@ABHINAV - This get all data should not be there!!!


    // $scope.tables = TablesService.query(function() {
    //
    //   // $scope.initializeActiveTable(function(){
    //   //   $scope.updateTableAttendantSerial();

    //   // });
    // });
    // console.log($scope.tables );

    var dateFormat = new Date();
    dateFormat.setHours(1);
    dateFormat.setMinutes(0);
    dateFormat.setSeconds(0);
    dateFormat.setMilliseconds(0);
    $scope.topDirections = ['left', 'up'];

    $scope.bottomDirections = ['down', 'right'];

    $scope.isOpen = false;

    $scope.availableModes = ['md-fling', 'md-scale'];
    $scope.selectedMode = 'md-scale';

    $scope.availableDirections = ['up', 'down', 'left', 'right'];
    $scope.selectedDirection = 'left';

    $scope.tableSerialEditing = false;

    $scope.packageorders = PackageorderService.query();


    $scope.generateBillAvailable = false;

    $scope.changeFoodOnly = function() {
      if ($scope.rentals.length > 0) {
        $scope.rent.foodOnly = true;
         // $mdToast.show(
         //   $mdToast.simple()
         //    .textContent('You cannot change table type , unless all customer are billed !')
         //    .hideDelay(3000)
         //    .position('bottom right')
        Notification.error('You cannot change table type , unless all customer are billed !');
      }
    };

// <<<<<<< HEAD
    // vm.tables = TablesService.query(function (response) {

    //   if ($stateParams.tableId) {
    //     for (var i = 0; i < response.length; i++) {
    //       if (response[i]._id === $stateParams.tableId) {
    //         $scope.rent.table = response[i]._id;
    //         $scope.rent.foodOnly = response[i].foodOnly;
    //         if (!$scope.rent.foodOnly) {
    //           if (response[i].serial) {
    //             response[i].serial.displaySerial = response[i].serial.serialNumber + '-' + response[i].serial.product.productNumber;
    //             $scope.rent.serialSelectedItem = response[i].serial;
    //             $scope.rent.serial = response[i].serial._id;
    //           }
    //         }
    //         break;
    //       }
    //     }
    //   } else {
    //     $scope.rent.table = response[0]._id;
    //     $scope.rent.foodOnly = response[0].foodOnly;
    //     if (!$scope.rent.foodOnly) {
    //       if (response[0].serial) {
    //         response[0].serial.displaySerial = response[0].serial.serialNumber + '-' + response[0].serial.product.productNumber;
    //         $scope.rent.serialSelectedItem = response[0].serial;
    //         $scope.rent.serial = response[0].serial._id;
    //       }
    //     }
    //   }
    //   $scope.getRentals();
    // }, function (err) {
    //   $scope.err = err;
    // });

    $scope.updateTableProperty = function() {
      // var deffered = $q.defer();
      for (var i = 0; i < $scope.tables.length; i++) {
        if ($scope.tables[i]._id === $scope.rent.table) {
          $scope.rent.table = $scope.tables[i]._id;
          $scope.rent.foodOnly = $scope.tables[i].foodOnly;
          $scope.rent.attendant = $scope.tables[i].currentAttendant._id;
          if (!$scope.rent.foodOnly) {
            if ($scope.tables[i].serial) {
              $scope.tables[i].serial.displaySerial = $scope.tables[i].serial.serialNumber + '-' + $scope.tables[i].serial.product.productNumber;
              $scope.rent.serialSelectedItem = $scope.tables[i].serial;
              $scope.rent.serial = $scope.tables[i].serial._id;
            }
          }
          break;
        }
      }
      $scope.getRentals();
    };

// =======

    $scope.tables = TablesService.query(function (response) {
      // $scope.loadUsers(function(){
        // $scope.rent.attendantSelectedItem = vm.authentication.user;
        // $scope.rent.attendant = $scope.rent.attendantSelectedItem._id;
        // console.log($state.params);
      if ($stateParams.tableId) {
          // console.log($stateParams.tableId);
          // $scope.rent.table = $stateParams.tableId;
        for (var i = 0; i < response.length; i++) {
          if (response[i]._id === $stateParams.tableId) {
            $scope.rent.table = response[i]._id;
            $scope.rent.currentTableObj = response[i];
              // $scope.rent.attendantSelectedItem = response[i].currentAttendant;
              // $scope.rent.attendant = response[i].currentAttendant._id || response[i].currentAttendant;
              // $scope.rent.foodOnly = response[i].foodOnly;
              // if (!$scope.rent.foodOnly) {
              //   if (response[i].serial) {
              //     response[i].serial.displaySerial = response[i].serial.serialNumber + '-' + response[i].serial.product.productNumber;
              //     $scope.rent.serialSelectedItem = response[i].serial;
              //     $scope.rent.serial = response[i].serial._id;
              //     // console.log(response[i].serial.renting);
              //   }
              // }
            break;
          }
        }
      } else {
          // console.log(null);
        $scope.rent.table = response[0]._id;
        $scope.rent.currentTableObj = response[0];
          // $scope.rent.attendantSelectedItem = response[0].currentAttendant;
          // $scope.rent.attendant = response[0].currentAttendant._id || response[0].currentAttendant;
          // $scope.rent.foodOnly = response[0].foodOnly;
          // if (!$scope.rent.foodOnly) {
          //   if (response[0].serial) {
          //     response[0].serial.displaySerial = response[0].serial.serialNumber + '-' + response[0].serial.product.productNumber;
          //     $scope.rent.serialSelectedItem = response[0].serial;
          //     $scope.rent.serial = response[0].serial._id;
          //   }
          // }
      }
      $scope.setFoodOnlyAndSerialForATable($scope.rent.currentTableObj);
      $scope.getRentals($scope.rent.currentTableObj);
      // });
    }, function (err) {
      $scope.err = err;
    });

    $scope.tableChanged = function(tableId) {
      // console.log(tableId);
      for (var i = 0; i < $scope.tables.length; i++) {
        if ($scope.tables[i]._id === tableId) {
          // $scope.rent.table = $scope.tables._id;
          $scope.rent.currentTableObj = $scope.tables[i];
          break;
        }
      }
      $scope.setFoodOnlyAndSerialForATable($scope.rent.currentTableObj);
      $scope.getRentals($scope.rent.currentTableObj);
    };

    $scope.setFoodOnlyAndSerialForATable = function(table) {
      // console.log(table);
      $scope.rent.foodOnly = table.foodOnly;
      if (!$scope.rent.foodOnly) {
        $scope.setSerialForATable(table);
      } else {
        $scope.rent.serialSelectedItem = '';
        $scope.rent.serial = '';
      }
    };

    $scope.setSerialForATable = function (table) {
      if (table.serial) {
        // table.serial.displaySerial = table.serial.serialNumber + '-' + table.serial.product.productNumber;
        $scope.rent.serialSelectedItem = table.serial;
        $scope.rent.serialSelectedItem.displaySerial = table.serial.serialNumber + '-' + table.serial.product.productNumber;
        $scope.rent.serial = table.serial._id;
      } else {
        $scope.rent.serialSelectedItem = '';
        $scope.rent.serial = '';
      }
    };

    // $scope.getRentals = function () {
    //   RentalsService.query({ table: $scope.rent.table }, function(response) {
    //     $scope.rentals = response;
    //     if ($scope.rentals.length > 0) {
    //       var tempArray = [];
    //       tempArray.push($scope.rentals[0].attendant);
    //       vm.users = tempArray;
    //       $scope.rent.attendant = $scope.rentals[0].attendant._id;
    //       $scope.appendRentals();
    //     }
    //   }, function(err) {
    //     $scope.error = err;
    //   });
    // };

    $scope.getRentals = function (table) {
      // for (var i = 0; i < $scope.tables.length; i++) {
      //   if ($scope.tables[i]._id === $scope.rent.table) {
      //     $scope.rent.foodOnly = $scope.tables[i].foodOnly;
      //     break;
      //   }
      // }

      // console.log('called');
// >>>>>>> 165ce42a4e08b975326139e857163f2ad7453a64
      RentalsService.query({ table: $scope.rent.table }, function(response) {
        $scope.rentals = response;
        if ($scope.rentals.length > 0) {
          // var tempArray = [];
          // tempArray.push($scope.rentals[0].attendant);
          // vm.users = tempArray;
          $scope.rent.attendant = $scope.rentals[0].attendant._id;
          $scope.rent.attendantSelectedItem = $scope.rentals[0].attendant;
          $scope.appendRentals();
        } else { // console.log(table);
          $scope.rent.attendantSelectedItem = table.currentAttendant;
          $scope.rent.attendant = table.currentAttendant || table.currentAttendant._id;
        }
      }, function(err) {
        $scope.error = err;
      });
    };

    $scope.appendSerials = function(callback) {
      // $scope.test= 'work';$scope.test1='work';
      for (var k = 0; k < $scope.serials.length; k++) {

        $scope.serials[k].displaySerial = $scope.serials[k].serialNumber + ' - ' + $scope.serials[k].product.productNumber;
        $scope.serials[k].alreadyRenting = false;
      }

      for (var j = 0; j < $scope.tables.length; j++) {
        if ($scope.tables[j]._id !== $scope.rent.table) {
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

      $scope.serials.sort(function(a, b) {
        if (a.product.productNumber < b.product.productNumber) return -1;
        if (a.product.productNumber > b.product.productNumber) return 1;
        return 0;
      });

      if (callback) callback();

    };

    $scope.querySerials = function(searchText) {
      var deffered = $q.defer();
      Serials.query({ searchText: searchText, renting: false }, function(res) {
        for (var i = 0; i < res.length; i++) {
          res[i].displaySerial = res[i].serialNumber + '-' + res[i].product.productNumber;
          // res[i].renting = true;
          // res[i].status = 'In Stock';
         // console.log(res[i]);
        }
        // console.log(res);
        deffered.resolve(res);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    };

    $scope.selectedSerialItemChange = function(item) {
      if (item) {
        $scope.rent.serial = $scope.rent.serialSelectedItem._id;
      } else {
        $scope.rent.serial = '';
      }
    };

    $scope.selectedAttedantItemChange = function(item) {
      if (item) {
        $scope.rent.attendant = $scope.rent.attendantSelectedItem._id;
      } else {
        $scope.rent.attendant = '';
      }
    };

    /*
    *   Dialog sections.
    */
    $scope.appendRentals = function(callback) {

      var tempStartTime = new Date();
      var tempStartTimeString = '';
      var tempEndTime = new Date();
      var tempEndTimeString = '';
      var k;
      for (var i = 0; i < $scope.rentals.length; i++) {
        tempStartTime = new Date($scope.rentals[i].rentalStart);
        tempStartTimeString = tempStartTime.toLocaleTimeString();
        k = tempStartTimeString.lastIndexOf(':');
        $scope.rentals[i].startTimeString = tempStartTimeString.slice(0, k) + tempStartTimeString.slice(k + 3, tempStartTimeString.length);
      }

      for (var j = 0; j < $scope.rentals.length; j++) {
        tempEndTime = new Date($scope.rentals[j].rentalEnd);
        tempEndTimeString = tempEndTime.toLocaleTimeString();
        k = tempEndTimeString.lastIndexOf(':');
        $scope.rentals[j].endTimeString = tempEndTimeString.slice(0, k) + tempEndTimeString.slice(k + 3, tempEndTimeString.length);
      }

      if (callback) callback();
    };
    // console.log(vm.tables);

    $scope.openAddCustomerDialog = function(ev, passObj) {
     // console.log(passObj);
      $mdDialog.show({
        controller: 'AddCustomerTORentalController',
        templateUrl: 'modules/rentals/client/views/addCustomerToRentalController.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: false,
        fullscreen: false,

        resolve: {
          packageorders: function() {
            return PackageorderService.query();
          }
        },
        locals: {
          passObj: passObj,
          foodOnly: $scope.rent.foodOnly
        }

      }).then(function(res) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('customer added Successfully !')
            .hideDelay(3000)
            .position('top right')
          );

        $scope.rentals.push(res);
        $scope.appendRentals();
        $scope.button = true;
      }, function() {
        $scope.status = 'You cancelled the dialog.';
        $scope.button = true;
      });
    };

    $scope.addCustomerbuttonclicked = function(ev) {
      // $scope.addCustomerclicked = !$scope.addCustomerclicked;
      // $scope.savedRentalSuccessfully=false;
      // $scope.focusRental();
      $scope.button = false;
      if ($scope.rent.table) {
        if ($scope.rent.attendant) {
          var passObj = {
            foodOnly: $scope.rent.foodOnly
          };
          if ($scope.rent.foodOnly) {
            passObj = {
              table: $scope.rent.table,
              attendant: $scope.rent.attendant
            };
            $scope.openAddCustomerDialog(ev, passObj);
          } else {
            if ($scope.rent.serial) {
              passObj = {
                table: $scope.rent.table,
                attendant: $scope.rent.attendant,
                serial: $scope.rent.serial
              };
              $scope.openAddCustomerDialog(ev, passObj);
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Please select Serial !')
                  .hideDelay(3000)
                  .position('top right')
                );
            }
          }
          // passObj.foodOnly = $scope.rent.foodOnly;

        } else {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Please select Attendant !')
              .hideDelay(3000)
              .position('top right')
            );
        }
      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Please select table !')
            .hideDelay(3000)
            .position('bottom right')
          );
      }
    };

    /*
    * food order dialog
    */
    $scope.addFoodOder = function(ev, rental) {
      $scope.button = false;
      $mdDialog.show({
        controller: 'AddFoodOderToRentalController',
        templateUrl: 'modules/rentals/client/views/addFoododerToRental.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        bindToController: false,
        fullscreen: false,
        locals: {
          rental: rental
        }
      }).then(function(res) {
        $scope.button = true;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Food Order added Successfully !')
            .hideDelay(3000)
            .position('top right')
          );
        $scope.rentals[$scope.rentals.indexOf(rental)] = res;
      }, function() {
        $scope.button = true;
        $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.generateBillForAllCheck = function(tableId) {
      var selectedRentalsInTable = filterFilter($scope.rentals, { selected: true });
      if (selectedRentalsInTable.length > 0) $scope.generateBillAvailable = true;
      else $scope.generateBillAvailable = false;
    };

    $scope.generateBillCheck = function(rental, tableId) {
      // console.log(rental.selected);
      if (rental.selected === true) {
        $scope.generateBillAvailable = true;
      } else {
        $scope.generateBillForAllCheck(tableId);
      }
    };

    $scope.toggleAllCheckboxes = function() {
      if ($scope.rent.selectedAll) {
        $scope.rent.selectedAll = false;
      } else {
        $scope.rent.selectedAll = true;
      }
      angular.forEach($scope.rentals, function (rental) {
        // if(!rental.bill)
        rental.selected = $scope.rent.selectedAll;
      });

    };

    $scope.showBillDialog = function(ev) {
      $scope.button = false;
      var rentalsToBeBilled = filterFilter($scope.rentals, { selected: true });
      // console.log(rentalsToBeBilled);
      $mdDialog.show({
        controller: 'GenerateBillController',
        templateUrl: 'modules/rentals/client/views/generateBill.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: false,
        fullscreen: false,
        resolve: {
          packageorders: function() {
            return PackageorderService.query();
          }
        },
        locals: {
          rentals: $scope.rentals,
          rentalsToBeBilled: rentalsToBeBilled,
          foodOnly: $scope.rent.foodOnly
        }
      }).then(function(res) {
        $scope.button = true;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Bill Generated Successfully !')
            .hideDelay(3000)
            .position('top right')
          );
        $scope.getRentals();
      }, function() {
        $scope.button = true;
        $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.rentalHistoryDialog = function(ev, rental) {
      $scope.button = false;
      $mdDialog.show({
        controller: 'RentalHistoryController',
        templateUrl: 'modules/rentals/client/views/rentalHistory.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: false,
        fullscreen: false,
        locals: {
          rental: rental,
          foodOnly: $scope.rent.foodOnly
        }
      }).then(function(res) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('History displayed')
            .hideDelay(3000)
            .position('top right')
          );
      }, function() {
        $scope.button = true;

        $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.transferDialog = function(ev, rental) {
      $scope.button = false;
      $mdDialog.show({
        controller: 'TransferRentalController',
        templateUrl: 'modules/rentals/client/views/transferRental.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        bindToController: false,
        fullscreen: true,
        locals: {
          rental: rental,
          tableId: $scope.rent.table,
          foodOnly: $scope.rent.foodOnly
        }
      }).then(function(res) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Rental Transfer Successfully!')
            .hideDelay(3000)
            .position('top right')
          );
        $scope.rent.table = res;
        $scope.getRentals();
        $scope.button = true;
      }, function() {
        $scope.button = true;
        $scope.status = 'You cancelled the dialog.';
        $mdToast.show(
          $mdToast.simple()
            .textContent('You Cancel Rental Transfer!')
            .hideDelay(3000)
            .position('top right')
          );
      });
    };

    $scope.packageOrderDialog = function(ev, rental) {
      $scope.button = false;
      $mdDialog.show({
        controller: 'AddPackageOrderToRentalController',
        templateUrl: 'modules/rentals/client/views/addPackageorderToRental.client.view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        bindToController: false,
        fullscreen: false,
        locals: {
          rental: rental,
          tableId: $scope.rent.table,
          foodOnly: $scope.rent.foodOnly
        }
      }).then(function(res) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Package Added Successfully!')
            .hideDelay(3000)
            .position('top right')
          );
        $scope.rent.table = res;
       // console.log(res);
        $scope.button = true;
      }, function() {
        $scope.button = true;
        $scope.status = 'You cancelled the dialog.';
      });
    };


    /** *************** function to Update Table Attendant Serial******************* **/

    $scope.updateTableAttendantSerial = function() {
      // $scope.test3 = 'HI5';
      $scope.tables = TablesService.query(function() {

        for (var i = 0; i < $scope.tables.length; i++) {
          if ($scope.tables[i]._id === $scope.rent.table) {
            if ($scope.tables[i].currentAttendant) {
              $scope.rent.attendantDisplayName = $scope.tables[i].currentAttendant.displayName;
              $scope.rent.attendant = $scope.tables[i].currentAttendant._id;
            } else {
              $scope.rent.attendant = $scope.authentication.user._id;
              $scope.rent.attendantDisplayName = $scope.authentication.user.displayName;
              // $scope.rent.attendant = '';
              // $scope.rent.attendantDisplayName = '';
            }
            // $scope.test = $scope.tables[i].serial;
            if ($scope.tables[i].serial) {
              $scope.rent.serial = $scope.tables[i].serial._id;
              $scope.rent.displaySerial = $scope.tables[i].serial.serialNumber + ' - ' + $scope.tables[i].serial.product.productNumber;
            } else {
              $scope.rent.serial = '';
              $scope.rent.displaySerial = '';
            }
            if ($scope.tables[i].status === 'unavailable') {
              $scope.selectedTableUnavailable = true;
            } else
              $scope.selectedTableUnavailable = false;

            break;
          }

          $scope.appendSerials();
          $scope.generateBillForAllCheck($scope.rent.table);
        }
      });
    };


/** ********************* Function to check if table is available  ************************* **/

    $scope.tableAvailable = function() {
      for (var i = 0; i < $scope.tables.length; i++) {
        if ($scope.tables[i]._id === $scope.rent.table) {
          if ($scope.tables[i].status === 'available')
            return true;
          else return false;
          // break;
        }
      }
    };

/** ******************************* function to Append Serials ********************************* **/

    $scope.appendSerials = function(callback) {
      // $scope.test= 'work';$scope.test1='work';
      for (var k = 0; k < $scope.serials.length; k++) {

        $scope.serials[k].displaySerial = $scope.serials[k].serialNumber + ' - ' + $scope.serials[k].product.productNumber;
        $scope.serials[k].alreadyRenting = false;
      }

      for (var j = 0; j < $scope.tables.length; j++) {
        if ($scope.tables[j]._id !== $scope.rent.table) {
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

      $scope.serials.sort(function(a, b) {
        if (a.product.productNumber < b.product.productNumber) return -1;
        if (a.product.productNumber > b.product.productNumber) return 1;
        return 0;
      });

      if (callback) callback();

    };

    $scope.tableSerialEdit = function(table) {

      $scope.noRentalIsOn = true;

      var rentalsWithActiveRentalsInTable = filterFilter($scope.rentals, { table: { _id: table }, activeRental: true });

      for (var q = 0; q < rentalsWithActiveRentalsInTable.length; q++) {
        if (!rentalsWithActiveRentalsInTable[q].bill) {

          $scope.tableSerialEditing = !$scope.tableSerialEditing;
          $scope.noRentalIsOn = false;
          break;
        }
      }
      // $scope.editForSubmit();
      // $scope.updateTableAttendantSerial();
    };


  // -----function to Update Table Attendant Serial-----------------------
    $scope.updateTableAttendantSerial = function() {
      // $scope.test3 = 'HI5';
      $scope.tables = TablesService.query(function() {

        for (var i = 0; i < $scope.tables.length; i++)
          if ($scope.tables[i]._id === $scope.rent.table) {
            if ($scope.tables[i].currentAttendant) {
              $scope.rent.attendantDisplayName = $scope.tables[i].currentAttendant.displayName;
              $scope.rent.attendant = $scope.tables[i].currentAttendant._id;
            } else {
              $scope.rent.attendant = $scope.authentication.user._id;
              $scope.rent.attendantDisplayName = $scope.authentication.user.displayName;
              // $scope.rent.attendant = '';
              // $scope.rent.attendantDisplayName = '';
            }
            // $scope.test = $scope.tables[i].serial;
            if ($scope.tables[i].serial) {
              $scope.rent.serial = $scope.tables[i].serial._id;
              $scope.rent.displaySerial = $scope.tables[i].serial.serialNumber + ' - ' + $scope.tables[i].serial.product.productNumber;
            } else {
              $scope.rent.serial = '';
              $scope.rent.displaySerial = '';
            }
            if ($scope.tables[i].status === 'unavailable') {
              $scope.selectedTableUnavailable = true;
            } else
              $scope.selectedTableUnavailable = false;

            break;
          }

        $scope.appendSerials();
        $scope.generateBillForAllCheck($scope.rent.table);
      });
    };

    /* $scope.checkIfSerialAllreadyRenting=function(serialid,tableid){
      $scope.tables=Tables.query(function(){
        $scope.appendSerials(function(){
          for (var k = 0; k < $scope.serials.length; k++){
            if($scope.serials[k]._id === serialid){
              if($scope.serials[k].alreadyRenting === false){
              //$scope.test = 'work';
              $scope.alertSerialExchange(serialid,tableid);
              }
              else{
                //var d = window.confirm('Sorry serial already renting!');
                alert('Sorry serial already renting!');
                $scope.queryRental( $scope.queryCustomer);
              }
              break;
            }
          }
        });
      });
    }; */

    /** *******************************************Serial & Attendant Exchange***********************************************/

    $scope.checkIfSerialAllreadyRenting = function(serialid, tableid) {
      $scope.tables = TablesService.query(function() {
        $scope.appendSerials(function() {
          for (var k = 0; k < $scope.serials.length; k++) {
            if ($scope.serials[k]._id === serialid) {
              if ($scope.serials[k].alreadyRenting === false) {
              // $scope.test = 'work';
                $scope.alertSerialExchange(serialid, tableid);
              } else {
                // var d = window.confirm('Sorry serial already renting!');
                $window.alert('Sorry serial already renting!');
                $scope.queryRental($scope.queryCustomer);
              }
              break;
            }
          }
        });
      });
    };

    $scope.checkIfSerialAllreadyRentingBeforeCreating = function(serialid, customerid) {
      $scope.tables = TablesService.query(function() {
        $scope.appendSerials(function() {
          for (var k = 0; k < $scope.serials.length; k++) {
            if ($scope.serials[k]._id === serialid) {
              if ($scope.serials[k].alreadyRenting === false) {
                $scope.checkIfCustomerAlreadyRenting(customerid);
              } else {
                // var d = window.confirm('Sorry serial already renting!');
                $window.alert('Serial is already renting!');
                $scope.queryRental($scope.queryCustomer);
              }
              break;
            }
          }
        });
      });
    };

    $scope.checkIfSerialHasChanged = function(serialid, tableid, customerid) {
      if ($scope.rent.serial === '' || !$scope.rent.serial)
        $scope.errorRental = 'Please choose a game at the table before starting rental';
      else if ($scope.rent.customer === '' || !$scope.rent.customer)
        $scope.errorRental = 'Please choose a customer before starting rental';
      else if (!$scope.rent.expectedTime || $scope.rent.expectedTime === '' || $scope.rent.expectedTime === '00:00')
        $scope.errorRental = 'Please estimate Expected Rental Time before starting rental. Use Game Data to estimate if needed.';
      else {
        $scope.tables = TablesService.query(function() {

          $scope.appendSerials(function() {
            for (var k = 0; k < $scope.tables.length; k++) {
              if ($scope.tables[k]._id === tableid) {
                // if ($scope.tables[k].serial){
                if (!$scope.tables[k].serial || $scope.tables[k].serial._id === serialid) {
                  $scope.checkIfSerialAllreadyRentingBeforeCreating(serialid, customerid);
                } else {
                  $window.alert('Game changed by another user!');
                  $scope.updateTableAttendantSerial();
                }
                /* }
                else{
                  alert('No Serial for table!');
                  $scope.updateTableAttendantSerial();
                } */
                break;
              }
            }

          });
        });
      }
    };

    $scope.alertSerialExchange = function(serialid, tableid) {
      var tempSerial = '';
      for (var a = 0; a < $scope.serials.length; a++) {
        if ($scope.serials[a]._id === serialid) {
          // $scope.testing='called';
          tempSerial = $scope.serials[a];
          break;
        }
      }
      // $scope.testTempSerial=tempSerial;

      for (var c = 0; c < $scope.tables.length; c++) {
        if ($scope.tables[c]._id === tableid) {
          if ($scope.tables[c].serial.product.category === tempSerial.product.category) {
            $scope.tableSerialExchange(tableid);

          } else {
            var d = $window.confirm('Are You Sure You Want To Change Category!');
            if (d === true) {
              $scope.tableSerialExchange(tableid);
            }
          }
        }
      }

    };

    /** **************************************** Function to Append Rentals ********************************************* **/
    $scope.appendRentals = function(callback) {

      var tempStartTime = new Date();
      var tempStartTimeString = '';
      var tempEndTime = new Date();
      var tempEndTimeString = '';
      var k;
      for (var i = 0; i < $scope.rentals.length; i++) {
        tempStartTime = new Date($scope.rentals[i].rentalStart);
        tempStartTimeString = tempStartTime.toLocaleTimeString();
        k = tempStartTimeString.lastIndexOf(':');
        $scope.rentals[i].startTimeString = tempStartTimeString.slice(0, k) + tempStartTimeString.slice(k + 3, tempStartTimeString.length);
      }

      for (var j = 0; j < $scope.rentals.length; j++) {
        tempEndTime = new Date($scope.rentals[j].rentalEnd);
        tempEndTimeString = tempEndTime.toLocaleTimeString();
        k = tempEndTimeString.lastIndexOf(':');
        $scope.rentals[j].endTimeString = tempEndTimeString.slice(0, k) + tempEndTimeString.slice(k + 3, tempEndTimeString.length);
      }

      if (callback) callback();
    };

      /** ********** for expected Revenue ********************* **/
    $scope.expectedRevenueCalculations = function(callback) {

      for (var l = 0; l < $scope.rentals.length; l++) {
        if ($scope.rentals[l].activeRental) {
          // debugger;
          var rentalTemp = billCalcService.getFoodOrders($scope.rentals[l], $scope.foodorders, $scope.rentals, $scope.chargeMultiplierWithFood, $scope.isWeekend, $scope.weekendMemberShipdiscount, $scope.weekdayMemberShipdiscount, $scope.serviceCharge, $scope.vat, $scope.serviceTaxRateWithFood);

          rentalTemp = billCalcService.getAllRentalsForActiveRental(rentalTemp, $scope.rentals, $scope.gracePeriodForGames, $scope.isWeekend, $scope.chargeMultiplierWithoutFood, $scope.serviceCharge, $scope.serviceTaxParameter);

          if (!rentalTemp.isMember)
            rentalTemp = billCalcService.packageEffectForRental(rentalTemp, $scope.packageorders, $scope.rentals, $scope.packageFoodTypes, $scope.chargeMultiplierWithFood, $scope.serviceCharge, $scope.vat, $scope.serviceTaxRateWithFood, $scope.isWeekend, $scope.gracePeriodForGames, $scope.serviceTaxParameter, $scope.endTimeForActiveRental);

          $scope.rentals[l].expectedRevenue = rentalTemp.subTotalAmountForCustomer;

        }

        /* need to add logic for expected revenue

         if rental is active then call billCalc;

         then rental.expectedReveue = rental returned to billCalc .totalCharge for customer */

      // $scope.rentals[l].expectedRevenue = 0;

        /* for (var p = 0; p < $scope.packageorders.length; p++)
          if ($scope.packageorders[p].rental === $scope.rentals[l]._id)
            $scope.rentals[l].expectedRevenue += $scope.packageorders[p].package.packagePrice; */

      // var rentalFoodOrders = $scope.getFoodORdersforRental($scope.rentals[l]);

      // var expectedFoodRevenue = $scope.getFoodRevenueforRental($scope.rentals[l]);

        // $scope.rentals[l].expectedRevenue = $scope.rentals[l].expectedRevenue + expectedFoodRevenue;

        // var expectedGameRevenue = $scope.getGameRevenueforRental($scope.rentals[l]);

        // $scope.rentals[l].expectedRevenue = $scope.rentals[l].expectedRevenue + expectedGameRevenue;

      }

      if (callback) callback();
    };
  }
}());
