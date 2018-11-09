(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('RentalHistoryController', RentalHistoryController);

  RentalHistoryController.$inject = ['$scope', 'Authentication', 'TablesService', '$mdDialog', '$mdToast', 'CustomersService', '$q', 'RentalsService', 'rental', 'foodOnly', 'FoodTypeService', 'FoodsService'];

  function RentalHistoryController($scope, Authentication, TablesService, $mdDialog, $mdToast, CustomersService, $q, RentalsService, rental, foodOnly, FoodTypeService, FoodsService) {
    var vm = this;

    vm.authentication = Authentication;

    $scope.initialize = function() {
      /* $scope.foodtypes = foodtypes;
      $scope.foods = foods;
      $scope.foodorders = foodorders;
      $scope.addedfoodorders = [];
      $scope.rentalId = rentalId;
      $scope.customerId = customerId; */
      // $scope.addedTableForTransfer={};
      // console.log(rental);
      $scope.rental = rental;
      $scope.foodOnly = foodOnly;
      $scope.rentals = RentalsService.query(function() {
        console.log($scope.rentals);
        $scope.getAllRentalsForActiveRental();
      });
      // $scope.rentals=rentals;
      // $scope.tables= tables;
      // $scope.users=users;
      // $scope.serials=serials;
      // $scope.rentTransfer = { table: '',attendantDisplayName:'',displaySerial:'',attendant:'',serial:''};
      // $scope.updateTableAttendantSerialInTransferModal();
    };

    $scope.getAllRentalsForActiveRental = function() {
      $scope.rentalsForActiveRental = [];
      // var gameRentalTemp;
      var currentRental = $scope.rental;
      var tempStartTime = new Date();
      var tempStartTimeString = '';
      var tempEndTime = new Date();
      var tempEndTimeString = '';
      var k;

      while (currentRental) {
        if (!$scope.foodOnly) {
          tempStartTime = new Date(currentRental.renewalRentalStart);
          tempStartTimeString = tempStartTime.toLocaleTimeString();
          k = tempStartTimeString.lastIndexOf(':');
          currentRental.startTimeString = tempStartTimeString.slice(0, k) + tempStartTimeString.slice(k + 3, tempStartTimeString.length);

          tempEndTime = new Date(currentRental.rentalEnd);
          tempEndTimeString = tempEndTime.toLocaleTimeString();
          k = tempEndTimeString.lastIndexOf(':');
          currentRental.endTimeString = tempEndTimeString.slice(0, k) + tempEndTimeString.slice(k + 3, tempEndTimeString.length);
        }
        $scope.rentalsForActiveRental.push(currentRental);

        if (currentRental.renewalRental) {
          for (var j = 0; j < $scope.rentals.length; j++) {
            if ($scope.rentals[j]._id === currentRental.renewalRental) {
              currentRental = $scope.rentals[j];
              break;
            }
          }
        } else currentRental = '';
      }
      // return rentalsForActiveRental;
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  }
}());
