(function () {
  'use strict';

  // Foods controller
  angular
      .module('foods')
      .controller('FoodsController', FoodsController);

  FoodsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'foodResolve', 'Notification', 'FoodsService', 'FoodTypeService', '$mdDialog', 'FoodComponentService', '$q', 'SystemparametersService', 'filterFilter'];

  function FoodsController ($scope, $state, $window, Authentication, food, Notification, FoodsService, FoodTypeService, $mdDialog, FoodComponentService, $q, SystemparametersService, filterFilter) {
    // var vm = this;

    $scope.authentication = Authentication;
    // vm.food = food;

    $scope.initialize = function() {
      $scope.curPageFoodType = { page: 1 };
      $scope.searchTextFoodType = { text: '' };
      $scope.maxSize = 5;
      $scope.pageChangedFoodType($scope.searchTextFoodType.txt);
      $scope.limit = 10;
      $scope.error = null;
      $scope.form = {};
      $scope.foodTypeName = '';
      $scope.food = { foodName: '', foodPrice: 0 };
      $scope.searchFoodType = '';
      $scope.searchFood = '';
      $scope.editer = false;
      $scope.foods = '';
      $scope.edit = { foodTypeName: '' };
    // vm.editFood = { foodName: '', price: ''};
      foodTypePaginations($scope.searchFoodType);
    // foodPaginations(vm.searchFoodType);
    };

    $scope.createFoodType = function() {
      var foodType = new FoodTypeService({
        foodTypeName: $scope.foodTypeName
      });
      foodType.$save(function (response) {
        // $setPristine();
        $scope.pageChangedFoodType($scope.searchTextFoodType.txt);
        $scope.foodTypesOnPage.unshift(response);
        if ($scope.foodTypesOnPage.length > 10) {
          $scope.foodTypesOnPage.pop();
        } else {
          $scope.indexEndFoodType++;
        }
        $scope.totalItemsFoodType.count++;
        // $scope.indexEndFoodType = Math.min(($scope.curPageFoodType.page) * $scope.limit, $scope.totalItemsFoodType.count);
        // $scope.foodTypesOnPage.pop();
        Notification.success('FoodType ' + $scope.foodTypeName + ' is created');
        $scope.foodTypeForm.$setPristine();
        $scope.foodTypeForm.foodTypeName.$touched = false;
        $scope.foodTypeForm.foodTypeName.$dirty = false;
        $scope.foodTypeName = '';
      }, function (errorResponse) {
        $scope.errorFoodType = errorResponse.data.message;
        $scope.isVisible = false;
        $scope.errorFoodTypes = true;
        Notification.error($scope.errorFoodType);
      });
    };
    // $scope.systemparameters = SystemparametersService.query(function() {
    //   $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
    //   $scope.currencySymbol = $scope.currencySymbol;
    //   $scope.memMonthlyAmnt = (filterFilter($scope.systemparameters, { systemParameterName: 'Membership Monthly Amount' }, true)).pop().value;

    //   // $scope.serviceTax = (filterFilter($scope.systemparameters, { systemParameterName: 'Service Tax' }, true)).pop().value;
    //   $scope.allTaxIncluded = (filterFilter($scope.systemparameters, { systemParameterName: 'Tax included in price' }, true)).pop().value;
    //   $scope.addressOnBill = (filterFilter($scope.systemparameters, { systemParameterName: 'Address on Bill' }, true)).pop().value;
    //   if ($scope.allTaxIncluded === 'Y') {
    //     $scope.chargeMultiplierWithoutFood = 1 / (1 + $scope.serviceTax / 100);
    //   } else {
    //     $scope.chargeMultiplierWithoutFood = 1;
    //   }
    // });
    $scope.createFood = function(foodType) {
      // console.log($scope.food.foodName);
      var food = new FoodsService({
        foodtype: foodType._id,
        foodName: $scope.food.foodName,
        price: $scope.food.foodPrice
      });

      food.$save(function (response) {
        // $setPristine();
        // console.log(response.foodtype);
        foodPaginations(foodType._id);
        // $scope.pageChangedFoodType($scope.searchTextFoodType.text);
        Notification.success('Food ' + response.foodName + ' is created of Price ' + response.price);
        // $scope.foodForm.$setPristine();
        // $scope.foodForm.foodName.$touched=false;
        // $scope.foodForm.foodName.$dirty=false;
        // $scope.foodForm.foodPrice.$touched=false;
        // $scope.foodForm.foodPrice.$dirty=false;
        $scope.food = { foodName: '', foodPrice: 0 };
      }, function (errorResponse) {
        $scope.errorFoodType = errorResponse.data.message;
        $scope.isVisible = false;
        $scope.errorFoodTypes = true;
        Notification.error($scope.errorFoodType);
      });
    };

    $scope.foodTypeClicked = function(foodType) {
      // vm.activeFoodtype = foodType._id;
      if ($scope.activeFoodtype === foodType._id) {
        $scope.activeFoodtype = '';
        $scope.editer = false;
      } else {
        $scope.activeFoodtype = foodType._id;
        foodPaginations(foodType._id);
        // FoodsService.query({ foodType: foodType._id }, function(foodsInFoodType) {
        //   vm.foods = foodsInFoodType;
        // });
      }
    };

    $scope.deleteFood = function(food) {
      if ($window.confirm('Are you sure you want to delete Food by Name: ' + food.foodName + ' ?')) {
        food.active = false;
        food.$update(function (response) {
          // $setPristine();
          foodPaginations(response.foodtype._id);
          Notification.success('Food by Name ' + response.foodName + ' is Delete successfully !');
        }, function (errorResponse) {
          $scope.errorFood = errorResponse.data.message;
          Notification.error($scope.errorFood);
        });
      }

    };

    $scope.deleteFoodType = function(foodType) {
      if ($window.confirm('Are you sure you want to delete FoodType by Name: ' + foodType.foodTypeName + ' ?')) {
        foodType.active = false;
        foodType.$update(function (response) {
          // $setPristine();
          // console.log(response);
          // foodTypePaginations($scope.searchTextFoodType.text);
          $scope.pageChangedFoodType();
          Notification.success('Food Type by Name ' + response.foodTypeName + ' is Delete successfully !');
        }, function (errorResponse) {
          // console.log(errorResponse);
          $scope.errorFoodType = errorResponse.data.message;
          Notification.error($scope.errorFoodType);
        });
      }
    };

    $scope.editFoodType = function(foodType) {
      $scope.editer = true;
      $scope.edit.foodTypeName = foodType.foodTypeName;
    };
    $scope.cancelEditFoodType = function(foodType) {
      $scope.editer = false;
      $scope.edit.foodTypeName = foodType.foodTypeName;
    };

    $scope.updateFoodType = function(foodType) {
      $scope.editer = false;

      foodType.foodTypeName = $scope.edit.foodTypeName;

      foodType.$update(function (updatedFoodType) {
        Notification.success('Food Type by Name ' + updatedFoodType.foodTypeName + ' is Updated successfully !');
      }, function (errorResponse) {
        $scope.errorFoodType = errorResponse.data.message;
        Notification.error($scope.errorFoodType);
      });
    };

    $scope.updateFood = function(foodTobeUpdate) {
      // console.log(foodTobeUpdate);
      foodTobeUpdate.$update(function(updatedResponse) {
        Notification.success('Food Updated Successfully');
      }, function(errorResopnse) {
        Notification.error(errorResopnse);
      });
    };

    $scope.foodComponents = function(food) {
      console.log(food);
      $mdDialog.show({
        controller: foodComponentsController,
        templateUrl: '/modules/foods/client/views/view-foodcomponentsInFood.client.view.html',
        parent: angular.element(document.body),
        targetEvent: food,
        clickOutsideToClose: true,
        // fullscreen: true,
        escapeToClose: true,
        openFrom: {
          left: 500,
          width: 6,
          height: 6
        },
        locals: {
          food: food
        }
      })
      .then(function(answer) {
        // console.log(answer);
        $scope.dialoupdatefood();
        // when answer/response is send from dailog
      }, function() {
        foodPaginations(food.foodtype._id);
      });
    };

    function foodComponentsController($scope, $mdDialog, food, FoodComponentService, $q, FoodsService) {
      // console.log(food);
      $scope.foodInDailog = angular.copy(food);
      // console.log($scope.foodInDailog);
      $scope.dailogEditer = true;
      $scope.dailogHeader = food.foodName;
      $scope.foodComponentName = '';
      $scope.foodComponentUnit = '';
      $scope.selectedComponent = '';
      $scope.searchComponent = '';
      $scope.close = function() {
        $mdDialog.cancel();
      };

      $scope.editDailogData = function() {
        $scope.dailogEditer = false;
      };
      $scope.unEditDailogData = function() {
        $scope.dailogEditer = true;
      };
     /* $scope.dialoupdatefood = function(foodType){
        vm.editer = false;
        foodType.foodName = vm.foodName._id,
        foodType.price = vm.price
        console.log(foodType);
          foodType.$update(function(updatedResponse) {
          Notification.success('Food Updated Successfully');
        }, function(errorResopnse) {
          Notification.error(errorResopnse);
        });
      }*/
      $scope.addFoodComponentInFood = function() {
        // console.log($scope.foodInDailog.foodComponentsInFood);
        // console.log($scope.foodInDailog.foodComponentsInFood.length);

        // we have to implement code for uniqe list item(if one component is added and than user add same item again than it should added the quantity insted of adding new item in list with same name) -Hardik
        var components = { foodcomponent: $scope.selectedComponent._id, quantity: $scope.foodComponentUnit };
        var foodComponent = new FoodsService(food);
        foodComponent.foodName = $scope.foodInDailog.foodName;
        foodComponent.price = $scope.foodInDailog.price;
        foodComponent.foodComponentsInFood.push(components);
        foodComponent.$update(function (response) {
          Notification.success('Food ' + response.foodName + ' is saved with All Components');
          $scope.foodComponentUnit = '';
          $scope.selectedComponent = '';
          $scope.foodInDailog = response;
        }, function (errorResponse) {
          $scope.errorFoodType = errorResponse.data.message;
          $scope.isVisible = false;
          $scope.errorFoodTypes = true;
          Notification.error($scope.errorFoodType);
        });
      };
      $scope.querySearch = function(searchComponent) {
        var deferred = $q.defer();
        FoodComponentService.query({ foodComponent: searchComponent }, function(components) {
          // console.log(components);
          deferred.resolve(components);
        }, function(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };
      $scope.selectedItemChangeFoodComponent = function(selectedComponent) {
        if (selectedComponent !== undefined) {
          // console.log(selectedComponent);
          $scope.baseUnit = selectedComponent.baseUnit.baseUnitSymbol;
        }
      };
      $scope.createComponent = function() {
        $state.go('foods.component');
        $mdDialog.cancel();
      };
      $scope.removeComponentFromFood = function(foodComponent) {
        if ($window.confirm('Are you sure you want to delete Food Component by Name: ' + foodComponent.foodcomponent.foodComponentName + ' ?')) {
          var index = $scope.foodInDailog.foodComponentsInFood.indexOf(foodComponent);
          $scope.foodInDailog.foodComponentsInFood.splice(index, 1);
          var dataTobeUpdate = $scope.foodInDailog;
          dataTobeUpdate.$update(function(removedComponent) {
            Notification.success('Food component is successfully removed!');
              // $scope.foodInDailog = removedComponent;
          }, function(errorOnremove) {
            Notification.error(errorOnremove);
          });
        }
      };
    }

    function foodTypePaginations(searchFoodType) {
      FoodTypeService.query({ foodTypeName: searchFoodType }, function(foodTypeRes) {
        $scope.foodTypes = foodTypeRes;
      });
    }

    function foodPaginations(searchFood) {
      FoodsService.query({ foodType: searchFood }, function(foodRes) {
        $scope.foods = foodRes;
      });
    }

    $scope.pageChangedFoodType = function(searchText) {
      $scope.getFoodTypeCount = FoodTypeService.get({ foodTypeId: 'countForFoodType', foodTypeName: searchText }, function() {
        $scope.totalItemsFoodType = $scope.getFoodTypeCount;
        $scope.foodTypesOnPage = FoodTypeService.query({ page: $scope.curPageFoodType.page, limit: $scope.limit, foodTypeName: searchText }, function() {
          $scope.indexStartFoodType = ($scope.curPageFoodType.page - 1) * $scope.limit;
          // console.log($scope.indexStartFoodType);
          $scope.indexEndFoodType = Math.min(($scope.curPageFoodType.page) * $scope.limit, $scope.totalItemsFoodType.count);
          // console.log($scope.indexEndFoodType);
          // console.log($scope.indexEndFoodType);
          // console.log($scope.curPageFoodType.page);
          // console.log($scope.limit);
        });
      });
    };
  }
}());
