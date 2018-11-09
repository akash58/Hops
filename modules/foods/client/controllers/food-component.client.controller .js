(function () {
  'use strict';

  // Foods controller
  angular
    .module('foods')
    .controller('FoodComponents', FoodComponents);

  FoodComponents.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'FoodsService', 'FoodTypeService', '$mdDialog', 'FoodComponentService', '$q', 'UnitTypesService'];

  function FoodComponents ($scope, $state, $window, Authentication, Notification, FoodsService, FoodTypeService, $mdDialog, FoodComponentService, $q, UnitTypesService) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.food = food;
    vm.error = null;
    vm.form = {};
    vm.consumable = false;
    vm.ComponentEditer = false;
    vm.searchFoodComponent = '';
    vm.searchBaseUnit = '';
    vm.searchEditBaseUnit = '';
    // foodComponentPagination(vm.searchFoodComponent);
    vm.createFoodComponent = function () {
      var foodComponent = new FoodComponentService({
        foodComponentName: vm.foodComponentName,
        baseUnit: vm.selectedComponent,
        description: vm.description,
        // currentStock: vm.currentStock,
        consumable: vm.consumable
      });
      foodComponent.$save(function (savedFoodComponent) {
        $scope.componentForm.$setPristine();
        $scope.componentForm.componentName.$touched = false;
        $scope.componentForm.componentName.$valid = false;
        $scope.componentForm.componentBaseUnit.$touched = false;
        $scope.componentForm.componentBaseUnit.$valid = false;
        Notification.success('Food Component ' + vm.foodComponentName + ' is created !');
        vm.foodComponentName = '';
        vm.selectedComponent = '';
        vm.description = '';
        vm.baseUnit = '';
        // vm.currentStock = '';
        vm.consumable = '';
        // foodComponentPagination(vm.searchFoodComponent);
        $scope.pageChangedFoodComponent($scope.searchTextFoodComponent.txt);
      }, function (errorResponse) {
        vm.errorComponent = errorResponse.data.message;
        Notification.error(vm.errorComponent);
      });
    };
    vm.componentClicked = function(foodComponent) {
      // vm.ComponentEditer = true;
      if (vm.activeComponent === foodComponent._id) {
        vm.activeComponent = '';
        vm.ComponentEditer = false;
      } else {
        vm.activeComponent = foodComponent._id;
        // vm.edited.componentName = foodComponent.foodComponentName;
        vm.edited = { componentName: foodComponent.foodComponentName, description: foodComponent.description, currentStock: foodComponent.currentStock, consumable: foodComponent.consumable };
        vm.selectedComponent1 = foodComponent.baseUnit;
        // console.log(vm.edited);
      }
    };
    vm.editComponent = function(foodComponent) {
      vm.ComponentEditer = true;
      vm.edited1 = { componentName: foodComponent.foodComponentName, description: foodComponent.description, currentStock: foodComponent.currentStock, consumable: foodComponent.consumable };
      vm.selectedComponent1 = foodComponent.baseUnit;

      // vm.edited.componentName = foodComponent.foodComponentName;
      // vm.edited.description = foodComponent.description;
    };
    vm.cancelEditComponent = function(foodComponent) {
      vm.ComponentEditer = false;
      // vm.edited.componentName = foodComponent.foodComponentName;
    };
    vm.deleteComponent = function(foodComponent) {
      if ($window.confirm('Are you sure you want to delete foodComponent: ' + foodComponent.foodComponentName + ' ?')) {
        foodComponent.active = false;
        foodComponent.$update(function (updatedFoodComponent) {
          $scope.pageChangedFoodComponent($scope.searchTextFoodComponent.txt);
          Notification.success('Food Component ' + vm.edited.componentName + ' is Deleted Successfully');
        }, function (errorResponse) {
          vm.errorComponent = errorResponse.data.message;
          Notification.error(vm.errorComponent);
        });
      }
    };
    vm.updateComponent = function(foodComponent) {
      foodComponent.foodComponentName = vm.edited.componentName;
      foodComponent.baseUnit = vm.selectedComponent1;
      foodComponent.description = vm.edited.description;
      // foodComponent.currentStock = vm.edited.currentStock;
      foodComponent.consumable = vm.edited.consumable;
      foodComponent.$update(function (updatedFoodComponent) {
        Notification.success('Food Component ' + vm.edited.componentName + ' is Updated Successfully');
        $scope.pageChangedFoodComponent($scope.searchTextFoodComponent.txt);
        // $scope.foodComponentPagination();
        // UnitTypesService.query();
      }, function (errorResponse) {
        vm.errorComponent = errorResponse.data.message;
        Notification.error(vm.errorComponent);
      });
    };
    // vm.selectedComponentChange = function(baseUnit) {
    //   vm.baseUnit = baseUnit._id;
    //   vm.edited.baseUnit = baseUnit._id;
    // };
    vm.querySearchForBaseUnit = function(searchBaseUnit) {
      var deferred = $q.defer();
      UnitTypesService.query({ baseUnit: searchBaseUnit }, function(baseUnits) {
          // console.log(baseUnit);
        deferred.resolve(baseUnits);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    // function foodComponentPagination(searchFoodComponent) {
    //   FoodComponentService.query({ foodComponentName: searchFoodComponent }, function(listFoodComponents) {
    //     vm.foodComponents = listFoodComponents;
    //     // console.log(vm.foodComponents);
    //   });
    // }

    $scope.pageChangedFoodComponent = function(searchText) {
      $scope.getFoodComponentCount = FoodComponentService.get({ foodComponentId: 'count', foodComponentName: searchText }, function() {
        $scope.totalItemsFoodComponent = $scope.getFoodComponentCount;
        $scope.foodComponents = FoodComponentService.query({ page: $scope.curPageFoodComponent.page, limit: $scope.limit, foodComponentName: searchText }, function() {
          $scope.indexStartFoodComponent = ($scope.curPageFoodComponent.page - 1) * $scope.limit;
          $scope.indexEndFoodComponent = Math.min(($scope.curPageFoodComponent.page) * $scope.limit, $scope.totalItemsFoodComponent.count);
        });
      });
    };

    $scope.createBaseUnit = function() {
      $state.go('unitType.create');
    };

    $scope.limit = 10;
    $scope.curPageFoodComponent = { page: 1 };
    $scope.searchTextFoodComponent = { text: '' };
    $scope.maxSize = 5;
    $scope.pageChangedFoodComponent($scope.searchTextFoodComponent.txt);
  }
}());
