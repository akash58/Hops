(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('AddFoodOderToRentalController', AddFoodOderToRentalController);

  AddFoodOderToRentalController.$inject = ['$scope', /* 'tableResolve', */ 'Authentication', 'TablesService', '$mdDialog', '$mdToast', 'CustomersService', '$q', 'RentalsService', 'rental', 'FoodTypeService', 'FoodsService', 'FoodOrdersService', 'InventoryActivitysService', 'FoodComponentService', '$window'];

  function AddFoodOderToRentalController($scope, /* tableResolve, */ Authentication, TablesService, $mdDialog, $mdToast, CustomersService, $q, RentalsService, rental, FoodTypeService, FoodsService, FoodOrdersService, InventoryActivitysService, FoodComponentService, $window) {
    var vm = this;

    vm.authentication = Authentication;
    /* *************************
    *
    */
    $scope.foodComponentInFoods = FoodsService.query();
    // $scope.foodcomponentinfoods =foodcomponentinfoods;
    // console.log($scope.foodComponentInFoods);
    // vm.tables = TablesService.query();
    // console.log(vm.tables);
    $scope.rental = rental;
    // console.log(rental);
    var dateFormat = new Date();
    dateFormat.setHours(1);
    dateFormat.setMinutes(0);
    dateFormat.setSeconds(0);
    dateFormat.setMilliseconds(0);

    $scope.foodToBeAdded = {
      foodTypeSelectedItem: '',
      foodTypeSearchText: '',
      foodSelectedItem: '',
      foodSearchText: '',
      quantity: ''
    };

    $scope.tempFoodOrders = [];
    $scope.foodOrdered = FoodOrdersService.query({ rental: $scope.rental._id });
    // console.log($scope.foodOrdered);
    $scope.queryFoodType = function(searchText) {
      var deferred = $q.defer();
      FoodTypeService.query({ searchText: searchText }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.selectedFoodTypeItemChange = function(item) {
      if (!item && $scope.foodToBeAdded.foodSelectedItem) {
        $scope.foodToBeAdded.foodSelectedItem = '';
      }
    };
    // $scope.selectedFoodTypeItemChange = function(item) {
    //   if (item) {
    //     $scope.customerToBeAdded.customerID = item.customerId;
    //   }
    // };

    $scope.queryFood = function(searchText) {
      var deferred = $q.defer();
      var foodType = '';
      if ($scope.foodToBeAdded.foodTypeSelectedItem) {
        foodType = $scope.foodToBeAdded.foodTypeSelectedItem._id;
      }
      FoodsService.query({ searchText: searchText, foodType: foodType }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.selectedFoodItemChange = function(item) {
      if (item) {
        $scope.foodToBeAdded.foodTypeSelectedItem = item.foodtype;
      }
    };

    $scope.pushFoodOrder = function(callback) {
      var foodAlreadyAdded = false;
      for (var i = 0; i < $scope.tempFoodOrders.length; i++) {
        if ($scope.tempFoodOrders[i].food._id === $scope.foodToBeAdded.foodSelectedItem._id) {
          $scope.tempFoodOrders[i].quantity = $scope.tempFoodOrders[i].quantity + $scope.foodToBeAdded.quantity;
          foodAlreadyAdded = true;
          break;
        }
      }

      if (!foodAlreadyAdded) {
        var foodOrderObj = {
          food: $scope.foodToBeAdded.foodSelectedItem,
          foodType: $scope.foodToBeAdded.foodTypeSelectedItem,
          quantity: $scope.foodToBeAdded.quantity
        };
        $scope.tempFoodOrders.push(foodOrderObj);
      }
      $scope.errLowStockArray = [];
      if (callback) callback();
    };

    $scope.addFoodOrder = function() {
      if (!$scope.foodToBeAdded.foodSelectedItem || $scope.foodToBeAdded.foodSelectedItem === '') {
        $scope.error = 'Select Food Type';
      } else if (!$scope.foodToBeAdded.foodTypeSelectedItem || $scope.foodToBeAdded.foodTypeSelectedItem === '') {
        $scope.error = 'Select Food';
      } else if (!$scope.foodToBeAdded.quantity || $scope.foodToBeAdded.quantity === '') {
        $scope.error = 'Enter Quantity';
      } else {
        $scope.pushFoodOrder(function() {
          $scope.foodToBeAdded.foodSelectedItem = '';
          $scope.foodToBeAdded.foodTypeSelectedItem = '';
          $scope.foodToBeAdded.quantity = '';
        });
      }
    };

    $scope.stockBufferCount = function(callback) {

      var stockTempfoodComponent;
      $scope.errLowStockArray = [];
      var j;
      // $scope.testfoodorder = $scope.addedfoodorders.length;

      if ($scope.tempFoodOrders.length > 0) {
        // $scope.testfoodorder = $scope.addedfoodorders.length;

        for (var i = 0; i < $scope.tempFoodOrders.length; i++) {
          if ($scope.tempFoodOrders[i].food._id === $scope.foodToBeAdded.foodSelectedItem._id) {

            for (j = 0; j < $scope.foodComponentInFoods.length; j++) {
              if ($scope.foodComponentInFoods[j].food._id === $scope.foodToBeAdded.foodSelectedItem._id) {

                var quantityToMultiple = $scope.foodToBeAdded.quantity + $scope.tempFoodOrders[i].quantity;

                stockTempfoodComponent = ($scope.foodComponentInFoods[j].quantity * quantityToMultiple) * (100 + $scope.stockBufferParameter) / 100;

                if ($scope.foodComponentInFoods[j].foodcomponent.currentStock < stockTempfoodComponent) {
                  $scope.errLowStockArray.push('Low Inventory : ' + $scope.foodComponentInFoods[j].foodcomponent.foodComponentName + ' For ' + $scope.foodComponentInFoods[j].food.foodName);
                }
              }
            }
            break;
          } else {
            $scope.stockBufferCountNotForAddedFoodorders();
          }
        }
      } else {
        $scope.stockBufferCountNotForAddedFoodorders();
      }
      if (callback) callback();
    };

    $scope.stockBufferCountNotForAddedFoodorders = function() {
      var stockTempfoodComponent;
      $scope.errLowStockArray = [];
      for (var j = 0; j < $scope.foodcomponentinfoods.length; j++) {
        if ($scope.foodcomponentinfoods[j].food._id === $scope.foodToBeAdded.foodSelectedItem._id) {

          stockTempfoodComponent = ($scope.foodcomponentinfoods[j].quantity * $scope.foodToBeAdded.quantity) * (100 + $scope.stockBufferParameter) / 100;
            // $scope.test1 = stockTempfoodComponent;
          if ($scope.foodcomponentinfoods[j].foodcomponent.currentStock < stockTempfoodComponent) {
            // $scope.test2 = stockTempfoodComponent;
            // $scope.errLowStock = 'Low Inventory : '+$scope.foodcomponentinfoods[j].foodcomponent.foodComponentName+' For '+$scope.foodcomponentinfoods[j].food.foodName;
            $scope.errLowStockArray.push('Low Inventory : ' + $scope.foodcomponentinfoods[j].foodcomponent.foodComponentName + ' For ' + $scope.foodcomponentinfoods[j].food.foodName);
              /* alert('Please Check Inventory For Food Component : '+$scope.foodcomponentinfoods[j].foodcomponent.foodComponentName+' For '+$scope.foodcomponentinfoods[j].food.foodName+'; Because Its Might Be Low.'); */
          }
        }
      }
    };

    $scope.deleteTempFoodOder = function(foodOrder) {
      // console.log(foodOrder);
      $scope.tempFoodOrders.splice($scope.tempFoodOrders.indexOf(foodOrder), 1);
    };

    $scope.alertSubmitFoodOrder = function(callback) {
      if ($scope.foodToBeAdded.foodSelectedItem !== '' || $scope.foodToBeAdded.foodTypeSelectedItem !== '') {
        // console.log('called1');
        var d = $window.confirm('Please Add Food Before Placing Food-Order!');
        // console.log('called2');
        if (d === false) {
          $mdDialog.cancel();
          // console.log('called3');
        }
      } else $scope.saveFoodOrder(callback);
      // console.log('called4');
    };

    $scope.alertCancel = function() {
      if ($scope.tempFoodOrders.length !== 0) {
        var d = $window.confirm('Are You Sure You Want To Cancel Food-Order!');
        if (d === true) {
          $mdDialog.cancel();
        }
      } else $scope.cancel();
    };

    $scope.saveFoodOrder = function(callback) {
      var deferred = $q.defer();
      if ($scope.tempFoodOrders.length >= 1) {
        var orderTime = new Date();
        var foodOrderArray = [];
        for (var i = 0; i < $scope.tempFoodOrders.length; i++) {
          var foodorders = new FoodOrdersService({
            rental: $scope.rental._id,
            food: $scope.tempFoodOrders[i].food._id,
            customer: $scope.rental.customer._id,
            quantity: $scope.tempFoodOrders[i].quantity,
            table: $scope.rental.table,
            status: 'Ordered',
            user: $scope.rental.attendant,
            orderTime: orderTime
          });
          foodOrderArray.push(foodorders);
        }
        var orderArray = {
          foodorders: foodOrderArray
        };
        FoodOrdersService.save({}, orderArray, function(response) {
          deferred.resolve(response);
          $mdToast.show(
              $mdToast.simple()
                .textContent(response.docs.length + 'Order saved successfully!')
                .position('top right')
                .hideDelay(3000)
            );
          rental.foodorders = response;
          // $scope.doSynchronousLoop(rental.foodorders, $scope.processFoodOrder, callback)
          $scope.addInventoryActivitys(rental.foodorders);
          $mdDialog.hide(rental);
        }, function(err) {
          deferred.reject(err.data.message);
          $mdToast.show(
              $mdToast.simple()
                // .textContent(err.data.message)
                .textContent(err)
                .position('top right')
                .hideDelay(5000)
            );
        });
      }
      // var foods =

      // console.log('called');
    };

    $scope.addInventoryActivitys = function(foodOrdered) {
      // $scope.abc = FoodsService.query();
      // console.log(Array.isArray($scope.abc));
      // console.log($scope.abc);
      // console.log($scope.foodComponentInFoods[1].foodComponentsInFood[0]);
      // var deferred = $q.defer();
      // console.log('work');
      // console.log(foodOrdered);
      // console.log($scope.foodComponentInFoods);
      // console.log(foodOrdered.docs);
      var promises = [];
      for (var i = 0; i < foodOrdered.docs.length; i++) {
        // console.log(foodOrdered.docs[i].food);

        // vm.foodComponentInFoods = FoodsService.query();
        // console.log($scope.foodComponentInFoods[1]);
        for (var j = 0; j < $scope.foodComponentInFoods.length; j++) {
          console.log($scope.foodComponentInFoods[j].foodComponentsInFood[i]);
          // console.log($scope.foodComponentInFoods[j].foodComponentsInFood[j]);
          // console.log($scope.foodComponentInFoods);
          // console.log(j);
          // console.log(foodOrdered.docs[i].food);
          if (foodOrdered.docs[i].food === $scope.foodComponentInFoods[j]._id) {
            // var deferred = $q.defer();
            // console.log('work10');
            for (var k = 0; k < $scope.foodComponentInFoods[j].foodComponentsInFood.length; k++) {
              // console.log($scope.foodComponentInFoods[j].foodComponentsInFood[k].quantity);

              var addedOrRemovedStock = Number(Number(foodOrdered.docs[i].quantity) * Number($scope.foodComponentInFoods[j].foodComponentsInFood[k].quantity));
              // console.log(addedOrRemovedStock);

              // var successfullyAddedInventoryActivity = $scope.addInventoryActivity(foodcomponentinfood.foodcomponent._id, foodorder, addedOrRemovedStock);
              // console.log('work2');
              // console.log($scope.foodComponentInFoods[j].foodComponentsInFood[k].foodcomponent);
              // console.log($scope.foodComponentInFoods[j].foodComponentsInFood[k].foodcomponent._id);
              // promises.push($scope.addInventoryActivity($scope.foodcomponentinfoods[j].foodComponentsInFood[k].foodcomponent._id, foodOrdered, addedOrRemovedStock));
              var foodComponentId = $scope.foodComponentInFoods[j].foodComponentsInFood[k].foodcomponent._id;
              promises.push($scope.addInventoryActivity(foodComponentId, foodOrdered.docs[i]._id, addedOrRemovedStock));
              // console.log('work3');
            }
          }
        }
      }

      var allPromise = $q.all(promises);
      return allPromise;
    };


    $scope.addInventoryActivity = function(foodComponentId, foodOrdered, addedOrRemovedStock) {
/*       console.log('work4');
      console.log(foodComponentId);
      console.log(foodOrdered);
      console.log(foodOrdered);
      console.log(FoodComponentService.get({ foodcomponentId: foodComponentId })); */
      var deferred = $q.defer();
      FoodComponentService.get({ foodcomponentId: foodComponentId }, function(foodComponent) {
/*         console.log('work5');
        console.log(foodComponent.currentStock);
        console.log(addedOrRemovedStock);
        console.log(Number(foodComponent.currentStock) - Number(addedOrRemovedStock)); */

        var inventoryactivity = new InventoryActivitysService({
          startingStock: foodComponent.currentStock,
          addedOrRemovedStock: addedOrRemovedStock,
          endingStock: (foodComponent.currentStock - addedOrRemovedStock),
          foodcomponent: foodComponentId,
          activityType: 'Food Order',
          foodOrder: foodOrdered._id
        });
        // console.log('work6');
        inventoryactivity.$save(function(response) {
          // $scope.test = 'inventoryactivity done:' + Date.now();
          foodComponent.currentStock = inventoryactivity.endingStock;

          foodComponent.$update(function(response) {
            deferred.resolve();
          }, function(e) {
            deferred.reject(e);
          });
          // console.log('work7');
        }, function(e) {
          deferred.reject(e);
        });
      }, function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
}());
