(function () {
  'use strict';

  // Packages controller
  angular
    .module('packages')
    .controller('PackagesController', PackagesController);

  PackagesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'packageResolve', 'CategoriesService', '$q', 'PackagesService', 'Notification', 'FoodTypeService', 'PackageFoodTypeService', 'SystemparametersService', 'filterFilter'];

  function PackagesController ($scope, $state, $window, Authentication, packageService, CategoriesService, $q, PackagesService, Notification, FoodTypeService, PackageFoodTypeService, SystemparametersService, filterFilter) {
    var vm = this;
    vm.authentication = Authentication;
    vm.package = packageService;
    vm.error = null;
    vm.searchText = '';
    vm.searchFoodTypeForPackage = '';
    vm.allowedToAddFoodType = false;
    vm.limit = 10;
    vm.curPagePackage = { page: 1 };
    vm.searchTextPackage = { text: '' };
    vm.maxSize = 5;

    // paginationOnPackage(vm.searchText);
    vm.systemparameters = SystemparametersService.query(function() {
      vm.currencySymbol = (filterFilter(vm.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
      vm.currencySymbol = vm.currencySymbol;
      vm.memMonthlyAmnt = (filterFilter(vm.systemparameters, { systemParameterName: 'Membership Monthly Amount' }, true)).pop().value;
      vm.serviceTax = (filterFilter(vm.systemparameters, { systemParameterName: 'Service Tax' }, true)).pop().value;
      vm.allTaxIncluded = (filterFilter(vm.systemparameters, { systemParameterName: 'Tax included in price' }, true)).pop().value;
      vm.addressOnBill = (filterFilter(vm.systemparameters, { systemParameterName: 'Address on Bill' }, true)).pop().value;
      if (vm.allTaxIncluded === 'Y') {
        vm.chargeMultiplierWithoutFood = 1 / (1 + vm.serviceTax / 100);
      } else {
        vm.chargeMultiplierWithoutFood = 1;
      }
    });
    vm.querySearchForCategory = function(searchCategory) {
      var deferred = $q.defer();
      CategoriesService.query({ category: searchCategory }, function(searchedCategory) {
        deferred.resolve(searchedCategory);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    vm.createPackage = function() {
      var newPackage = new PackagesService({
        packageName: vm.packageName,
        packagePrice: vm.packagePrice,
        category: vm.category._id,
        hours: new Date(vm.hours)
      });
      newPackage.$save(function(createdPackege) {
        vm.packageForm.$setPristine();
        vm.packageForm.packageName.$touched = false;
        vm.packageForm.packageName.$valid = false;
        vm.packageForm.packagePrice.$touched = false;
        vm.packageForm.packagePrice.$valid = false;
        vm.packageForm.category.$touched = false;
        vm.packageForm.category.$valid = false;
        vm.packageForm.hours.$touched = false;
        vm.packageForm.hours.$valid = false;

        vm.packageName = '';
        vm.packagePrice = '';
        vm.category = '';
        vm.hours = '';
        Notification.success('Package by the name ' + createdPackege.packageName + ' is Successfully!');
        // paginationOnPackage(vm.searchText);
        vm.pageChangedPackage(vm.searchTextPackage.txt);
      }, function(errorOnCreate) {
        Notification.error(errorOnCreate);
      });
    };
    vm.packageClicked = function(clickedPackage) {
      var hoursOfPackage = new Date(clickedPackage.hours);
      if (vm.activePackage === clickedPackage._id) {
        vm.activePackage = '';
        vm.packageEditer = false;
        vm.allowedToAddFoodType = false;
        vm.addFoodTypeInPackage = '';
        vm.addFoodTypeQuantity = '';
      } else {
        vm.activePackage = clickedPackage._id;
        paginationOnFoodTypeInPackage(clickedPackage._id);
        vm.packageEditer = false;
        vm.edit = { packageName: clickedPackage.packageName, packagePrice: clickedPackage.packagePrice, category: clickedPackage.category.categoryName, hours: hoursOfPackage };
      }
    };
    vm.deletePackage = function(packageToBEDelete) {
      if ($window.confirm('Are you sure you want to delete ' + packageToBEDelete.packageName + ' Package ?')) {
        packageToBEDelete.active = false;
        packageToBEDelete.$update(function(deactivatedPackage) {
          Notification.success(deactivatedPackage.packageName + ' Package is Deleted Successfully');
        });
      }
    };
    vm.editPackage = function(editedpackage) {
      vm.packageEditer = true;
    };
    vm.updatePackage = function(packageToBeUpdate) {
      packageToBeUpdate.packageName = vm.edit.packageName;
      packageToBeUpdate.packagePrice = vm.edit.packagePrice;
      packageToBeUpdate.category = vm.edit.category._id;
      packageToBeUpdate.hours = vm.edit.hours;
      packageToBeUpdate.$update(function(response) {
        Notification.success('Package is Updated Successfully!');
        vm.packageEditer = false;
      }, function(error) {
        Notification.error(error);
      });
    };
    vm.querySearchForFoodType = function(searchFoodType) {
      var deferred = $q.defer();
      FoodTypeService.query({ foodType: searchFoodType }, function(response) {
        deferred.resolve(response);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    vm.allowFoodTypeToAdd = function(foodTypeAddInPackage) {
      if (vm.allowedToAddFoodType === true) {
        vm.allowedToAddFoodType = false;
        vm.addFoodTypeInPackage = '';
        vm.addFoodTypeQuantity = '';
      } else {
        vm.allowedToAddFoodType = true;
      }
    };
    vm.createFoodType = function(foodTypeName) {
      $state.go('foods.create');
    };
    vm.createCategory = function(categoryName) {
      $state.go('categories.create');
    };
    vm.addFoodTypeInPackages = function(foodTypeInpackage) {
      var packageFoodtype = new PackageFoodTypeService({
        package: foodTypeInpackage._id,
        foodtype: vm.addFoodTypeInPackage._id,
        quantity: vm.addFoodTypeQuantity
      });
      packageFoodtype.$save(function(foodtypeadded) {
        vm.editpackageForm.$setPristine();
        vm.editpackageForm.addFoodType.$touched = false;
        vm.editpackageForm.addFoodType.$valid = false;
        vm.editpackageForm.addFoodTypeQuantity.$touched = false;
        vm.editpackageForm.addFoodTypeQuantity.$valid = false;
        Notification.success('Food Type ' + vm.addFoodTypeInPackage.foodTypeName + ' is added to Package ' + foodTypeInpackage.packageName + ' !');
        paginationOnFoodTypeInPackage(foodTypeInpackage._id);
        vm.addFoodTypeInPackage = '';
        vm.addFoodTypeQuantity = '';
      }, function(errorToAddFoodType) {
        Notification.error(errorToAddFoodType);
      });
    };
    vm.removeFoodtypeFromPackage = function(foodTypeToBeRemovedFromPackage) {
      foodTypeToBeRemovedFromPackage.$remove(function(successResponse) {
        Notification.success('Food Type is removed from package!');
        paginationOnFoodTypeInPackage(foodTypeToBeRemovedFromPackage.package);
      }, function(errorOnRemove) {
        Notification.error(errorOnRemove);
      });
    };
    vm.cancelEditPackage = function() {
      vm.packageEditer = false;
      vm.allowedToAddFoodType = false;
      vm.addFoodTypeInPackage = '';
      vm.addFoodTypeQuantity = '';
    };
    // function paginationOnPackage(searchPackage) {
    //   PackagesService.query({ searchPackage: searchPackage }, function(listOfPakages) {
    //     vm.packages = listOfPakages;
    //   }, function(errorOnlist) {
    //     Notification.error(errorOnlist);
    //   });
    // }
    function paginationOnFoodTypeInPackage(searchPackage) {
      PackageFoodTypeService.query({ searchFoodtypeInPackage: searchPackage }, function(listOfFoodTypeInPakages) {
        vm.foodTypeInPackages = listOfFoodTypeInPakages;
        // console.log(vm.foodTypeInPackages);
      }, function(errorOnlist) {
        Notification.error(errorOnlist);
      });
    }

    vm.pageChangedPackage = function(searchText) {
      vm.getPackageCount = PackagesService.get({ packageId: 'count', packageName: searchText }, function() {
        vm.totalItemsPackage = vm.getPackageCount;
        vm.packagesOnPage = PackagesService.query({ page: vm.curPagePackage.page, limit: vm.limit, packageName: searchText }, function(res) {
          vm.indexStartPackage = (vm.curPagePackage.page - 1) * vm.limit;
          vm.indexEndPackage = Math.min((vm.curPagePackage.page) * vm.limit, vm.totalItemsPackage.count);
        });
      });
    };

    vm.pageChangedPackage(vm.searchTextPackage.txt);
  }
}());
