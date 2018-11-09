(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('AddPackageOrderToRentalController', AddPackageOrderToRentalController);

  AddPackageOrderToRentalController.$inject = ['$scope', /* 'tableResolve', */ 'Authentication', '$mdDialog', '$mdToast', 'PackagesService', '$q', 'RentalsService', 'rental', 'FoodTypeService', 'FoodsService', '$state', 'PackageorderService', 'Notification', 'PackageFoodTypeService'];

  function AddPackageOrderToRentalController($scope, /* tableResolve, */ Authentication, $mdDialog, $mdToast, PackagesService, $q, RentalsService, rental, FoodTypeService, FoodsService, $state, PackageorderService, Notification, PackageFoodTypeService) {
    var vm = this;

    $scope.authentication = Authentication;
    $scope.packageSearchText = '';
    $scope.selectedPackage = '';
    $scope.packageOrders = [];
    // $scope.packageorders = packageorders;
    // console.log($scope.packageorders);
    $scope.rental = rental;
    // console.log(rental._id);
    $scope.addedPackageOrders = PackageorderService.query({ findByRental: rental._id });
    $scope.packages = PackagesService.query();
    // console.log($scope.addedPackageOrders);
    // $scope.queryPackage = function () {
    //   var deferred = $q.defer();

    //   return deferred.promise;
    // };

    $scope.savePackageOrder = function() {
      // console.log('packWork1');
      for (var i = 0; i < $scope.packageOrders.length; i++) {
        var packageOrder = new PackageorderService({
          rental: rental._id,
          package: $scope.packageOrders[i]._id,
          customer: rental.customer._id
        });
        // console.log('packWork2');
        packageOrder.$save(function(res) {
          $scope.packageOrders = [];
          $scope.packageSearchText = '';
          // console.log(packageOrder);
          $scope.addedPackageOrders = PackageorderService.query({ findByRental: rental._id });

          Notification.success('Package Order saved saved successfully');
          console.log(rental);
          $mdDialog.hide(rental);
        }, function(err) {
          $scope.error = err;
          Notification.error(err);
        });
      }
    };

    $scope.addPackageOrder = function() {
      if ($scope.selectedPackage !== '' && $scope.selectedPackage !== null) {

        $scope.packageOrders.push($scope.selectedPackage);
        console.log($scope.packageOrders);
        $scope.selectedPackageName = $scope.selectedPackage.packageName;
        $scope.rentpack = $scope.selectedPackage;
        $scope.packageFoodType = PackageFoodTypeService.query({ searchFoodtypeInPackage: $scope.selectedPackage._id });
      } else {
        $scope.error = 'Please select Package to add it';
      }
    };

    /** ************* to get hours based on the package selected  ****************/
    $scope.getExpectedtimeforPackage = function(sendpackages) {
      for (var i = 0; i < $scope.packages.length; i++)
        if ($scope.packages[i]._id === sendpackages) {
          return new Date($scope.packages[i].hours);
        }
    };

    $scope.removePackageOrder = function(packageOrderToBeRemove) {
      $scope.packageOrders.splice($scope.packageOrders.indexOf(packageOrderToBeRemove), 1);
      $scope.selectedPackage = '';
      $scope.selectedPackageName = '';
      $scope.rentpack = '';
      $scope.packageFoodType = false;
    };

    $scope.createPackage = function(packageSearchText) {
      $mdDialog.cancel();
      $state.go('packages.create');
    };
    $scope.selectedPackageChange = function(changedPackage) {
      $scope.error = false;
    };
    $scope.selectPackage = function(selectedPackageOrder) {
      $scope.orderedDate = new Date(selectedPackageOrder.created);
      // console.log(selectedPackageOrder);
      if (selectedPackageOrder.package) {
        $scope.id = selectedPackageOrder.package._id;
        $scope.rentpack = selectedPackageOrder.package;
        $scope.selectedPackageName = $scope.rentpack.packageName;
        $scope.packageSelected = true;
      } else {
        $scope.id = selectedPackageOrder._id;
      }
      $scope.packageFoodType = PackageFoodTypeService.query({ searchFoodtypeInPackage: $scope.id });
    };

    $scope.searchTextChange = function(packageSearchText) {
      $scope.error = false;
      var deferred = $q.defer();
      PackagesService.query({ packageName: packageSearchText }, function(packageRes) {
        deferred.resolve(packageRes);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.cancelPackageOrder = function() {
      $mdDialog.cancel();
    };
  }
}());
