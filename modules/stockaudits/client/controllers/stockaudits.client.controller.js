(function () {
  'use strict';

  // Stockaudits controller
  angular
    .module('stockaudits')
    .controller('StockauditsController', StockauditsController);

  StockauditsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'stockauditResolve', 'StockauditsService', 'Notification', '$http', 'filterFilter', 'FoodComponentService', 'SystemparametersService', 'InventoryActivitysService', '$q', '$stateParams', '$location', '$timeout', 'StockAuditInventoryActivitysService', 'UnitsService'];

  function StockauditsController ($scope, $state, $window, Authentication, stockaudit, StockauditsService, Notification, $http, filterFilter, FoodComponentService, SystemparametersService, InventoryActivitysService, $q, $stateParams, $location, $timeout, StockAuditInventoryActivitysService, UnitsService) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.stockaudit = stockaudit;
    // vm.error = null;
    // $scope.stockaudits = StockauditsService.query();
    vm.form = {};
    // console.log(vm.authentication);

    vm.searchFoodComponent = '';
    vm.searchBaseUnit = '';
    vm.searchEditBaseUnit = '';
    $scope.initialize = function() {
      $scope.tempFoodComponentsAdded = [];

      $scope.stckaud = { stockAuditNo: '', auditDate: $scope.todaysDate(), description: '' };
      $scope.stckfoodcom = { foodcomponent: '', physicalStock: '', description: '', baseunit: '' };
      // $scope.clearFoodComponent();

      $scope.limit = 10; // hard coded in the current pagination
      $scope.curPageStockAudit = { page: 1 };
      $scope.maxSize = 5;
      $scope.searchTextStockAudit = { text: '' };
      $scope.pageChangedStockAudit($scope.searchTextStockAudit.text);
      $scope.foodcomponents = FoodComponentService.query(function() {
        $scope.appendFoodcomp();
      });
      $scope.inventoryactivitys = InventoryActivitysService.query();
      $scope.getOrderNo(function() {
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.incrementparameters[i].name === 'Stock Audit No.') {
            $scope.stckaud.stockAuditNo = $scope.incrementparameters[i].value;
            $scope.newstockAuditNo = Number($scope.incrementparameters[i].value) + 1;
            $scope.setIncrementParameter('Stock Audit No.', $scope.newstockAuditNo);
            break;
          }
        }
      });
    };

    $scope.createFoodComponent = function() {
      $state.go('foods.component');
    };

    vm.querySearchForFoodComponent = function(foodComponentName) {
      var deferred = $q.defer();
      FoodComponentService.query({ foodComponentName: foodComponentName }, function(foodComponentName) {
          // console.log(baseUnit);
        deferred.resolve(foodComponentName);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.queryStockAudit = function() {
      $scope.stockaudits = StockauditsService.query();
    };
    // console.log($scope.queryStockAudit);

    $scope.clickStockAudit = function(stockaudit) {
      /* console.log(stockaudit);
      console.log($scope.activeStockAudit);
      console.log(stockaudit.stockAuditNumber);*/
      if ($scope.activeStockAudit === stockaudit.stockAuditNumber)
        $scope.activeStockAudit = '';
      else {
        $scope.activeStockAudit = stockaudit.stockAuditNumber;
        $scope.getStockAuditInventoryActivityForStockAudit(stockaudit._id);
      }
    };

/** ******************* today's date ******************** **/
    $scope.todaysDate = function() {
      var date = new Date();

/* 			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();

			if (month<10) month = '0' + month;
			if (day<10) day = '0' + day;

			var today = year + '-' + month + '-' + day; */
      return date;
    };

    $scope.stringifyDate = function(dateFromDB) {
      var dateNeeded = dateFromDB;

      var day = dateNeeded.substring(8, 10);
      var month = dateNeeded.substring(5, 7);
      var year = dateNeeded.substring(0, 4);

      // if (month<10) month = '0' + month;

      var dateString = year + '-' + month + '-' + day;

      return dateString;
    };

/** ************************************Get Reference No.Increment**************************************************** **/

    $scope.getStockAuditNo = function() {
      $scope.getOrderNo(function() {
       /* console.log( $scope.incrementparameters.length);
        console.log( $scope.incrementparameters);*/
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.errorStockAudit === false) {

            if ($scope.incrementparameters[i].name === 'Stock Audit No.') {
              $scope.stckaud.stockAuditNo = $scope.incrementparameters[i].value;
              $scope.newstockAuditNo = Number($scope.incrementparameters[i].value) + 1;
              $scope.setIncrementParameter('Stock Audit No.', $scope.newstockAuditNo);
              break;
            }
          }
        }
      });
    };


    $scope.setIncrementParameter = function(parameterName, parameterValue) {
      var tempIncrementParameter = {};
      for (var i = 0; i < $scope.incrementparameters.length; i++) {
        if ($scope.incrementparameters[i].name === parameterName) {
          tempIncrementParameter = $scope.incrementparameters[i];
          break;
        }
      }
      tempIncrementParameter.value = parameterValue;
      $http.put('/api/incrementparameters/' + tempIncrementParameter._id, tempIncrementParameter);
    };

/** *********************************************Get Reference No.***************************************************** **/
    $scope.getOrderNo = function(callback) {
      $http({
        method: 'GET',
        url: '/api/incrementparameters'
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        // console.log(response);
        var data = response.data;
        var status = response.status;

        $scope.incrementparameters = data;
        // console.log($scope.incrementparameters);
        if (callback) callback();
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        if (callback) callback();
      });
    };

/** ***********************************  pagination  ******************************************** **/
    $scope.pageChangedStockAudit = function(searchText) {
      $scope.getStockAuditCount = StockauditsService.get({ stockauditId: 'count', searchText: searchText }, function() {
        $scope.totalItemsStockAudit = $scope.getStockAuditCount;
      });
      // console.log('work1');
      // console.log($scope.totalItemsStockAudit);
      $scope.stockAuditsOnPage = StockauditsService.query({ page: $scope.curPageStockAudit.page, limit: $scope.limit, searchText: searchText }, function() {
        $scope.indexStart = ($scope.curPageStockAudit.page - 1) * $scope.limit;
        $scope.indexEnd = Math.min(($scope.curPageStockAudit.page) * $scope.limit, $scope.totalItemsStockAudit.count);
      });
    };

/** ***************** Foods ******************************** **/
    $scope.addStockAuditButtonClicked = function() {
      $scope.addStockAuditClicked = !$scope.addStockAuditClicked;
      $scope.focusStockAudit();
    };

    $scope.addFoodComponentsButtonClicked = function() {
      $scope.addFoodComponentsClicked = !$scope.addFoodComponentsClicked;
    };

    $scope.appendFoodcomp = function() {
      for (var k = 0; k < $scope.foodcomponents.length; k++)
        $scope.foodcomponents[k].alreadyAdded = false;
    };

/** ******************** add food component in temp food component order array ******************* **/

    var alreadyAddedCheck = function(arrayToCheck, NameToCheck) {
      // console.log(NameToCheck);
      for (var i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i].foodComponentName === NameToCheck.foodComponentName) return true;
      }
      return false;
    };

    $scope.addInTempFoodComponents = function() {

      if (vm.foodComponentName === '') {
        $window.alert('Please select Food Component!\n From the Food component drop down.');
      } else if ($scope.stckfoodcom.physicalStock === '') {
        $window.alert('Please enter the physical stock observed.');
      } else if (alreadyAddedCheck($scope.tempFoodComponentsAdded, vm.foodComponentName)) {
        $window.alert('Already Added! Please delete and then add again');
      } else {
        var foodComponentNameAdded = '';

        for (var r = 0; r < $scope.foodcomponents.length; r++) {
          /* console.log($scope.foodcomponents[r]._id);
          console.log(vm.foodComponentName._id);*/
          if ($scope.foodcomponents[r]._id === vm.foodComponentName._id) {
            foodComponentNameAdded = $scope.foodcomponents[r].foodComponentName;

            $scope.foodcomponents[r].alreadyAdded = true;
          }
        }

        $scope.tempFoodComponentsAdded.push({
          foodcomponent: vm.foodComponentName,
          foodComponentName: foodComponentNameAdded,
          physicalstock: $scope.stckfoodcom.physicalStock * $scope.selectedUnit.multiplierWithBaseUnit,
          baseunit: vm.foodComponentName.baseUnit.baseUnitSymbol,
          description: $scope.stckfoodcom.description
        });
        $scope.clearstckfoodcomValue();
        // console.log($scope.tempFoodComponentsAdded);
      }
    };

    $scope.clearstckfoodcomValue = function() {
      $scope.stckfoodcom.foodcomponent = '';
      $scope.stckfoodcom.physicalStock = '';
      $scope.stckfoodcom.description = '';
    };

    $scope.clearstckaudValue = function() {
      $scope.stckaud.description = '';
    };

    $scope.focusStockAudit = function() {
      $scope.savedStockAuditSuccessfully = false;
      $scope.errorStockAudit = false;
      $scope.errorSameFoodCompAdded = false;
    };
/** ******************** delete food component in temp food component order array ******************* **/
    $scope.deletedTempFoodComponent = function (foodComponent, callback) {
      $scope.tempFoodComponentsAdded.splice($scope.tempFoodComponentsAdded.indexOf(foodComponent), 1);
      for (var i = 0; i < $scope.foodcomponents.length; i++) {
        if ($scope.foodcomponents[i]._id === foodComponent.foodcomponent) {
          $scope.foodcomponents[i].alreadyAdded = false;
        }
      }
      if (callback) callback();
    };

/** **************** getBaseUnitValue *************** ***/
    /*  $scope.getBaseUnitValue = function(foodComponent) {
        for (var r = 0; r < $scope.foodcomponents.length; r++) {
        if ($scope.foodcomponents[r]._id === foodComponent._id) {
          $scope.stckfoodcom.baseunit = $scope.foodcomponents[r].baseUnit.baseUnit;
        }
      }
    };*/
    /* $scope.getBaseUnitValue = function(foodComponent) {
      // console.log(foodComponent);
      if (foodComponent) {
        for (var r = 0; r < $scope.foodcomponents.length; r++) {
          if ($scope.foodcomponents[r]._id === foodComponent._id) {
          // console.log(foodComponent._id);
          // console.log($scope.foodcomponents[r]._id);
            $scope.stckfoodcom.baseunit = $scope.foodcomponents[r].baseUnit.baseUnitSymbol;
          // console.log($scope.stckfoodcom.baseunit);
          }
        }
      } else {
        $scope.stckfoodcom.baseunit = '';
      }
    }; */

    $scope.getUnitsForUnitType = function(unitTypeId) {
      var deferred = $q.defer();
      UnitsService.query({ findByunitType: unitTypeId }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.getBaseUnitValue = function(foodComponent) {
      // console.log('calling');
      // console.log($scope.getBaseUnitValue);
      /* for(var r=0;r<$scope.foodcomponents.length;r++){
        if($scope.foodcomponents[r]._id === foodComponent){
          $scope.expFoodCom.baseunit=$scope.foodcomponents[r].baseUnit.baseUnit;
        }
      } */
      if (foodComponent) {
        $scope.getUnitsForUnitType(foodComponent.baseUnit._id)
          .then(function(unitsInCurrentUnitType) {
            $scope.unitsInCurrentUnitType = unitsInCurrentUnitType;
            $scope.selectedUnitId = foodComponent.baseUnit.baseUnitId;
            // console.log($scope.unitsInCurrentUnitType);
            $scope.unitChanged($scope.selectedUnitId);
          });
      }
/*       if (foodComponent) {
        console.log(foodComponent)
        $scope.expFoodCom.baseunit = foodComponent.baseUnit.baseUnitSymbol;
      } */
    };

    $scope.unitChanged = function(selectedUnitId) {
      for (var i = 0; i < $scope.unitsInCurrentUnitType.length; i++) {
        if ($scope.unitsInCurrentUnitType[i]._id === selectedUnitId) {
          $scope.selectedUnit = $scope.unitsInCurrentUnitType[i];
          break;
        }
      }
    };
/** **************** function to create a stock Audit   **************** **/
    $scope.createStockAudit = function() {
      if ($scope.tempFoodComponentsAdded.length === 0) {
        $window.alert('Please select Food Component within stock audit!\n By clicking plus button to food component.');
      } else {
        var sendStockAudits = new StockauditsService({
          stockAuditNumber: $scope.stckaud.stockAuditNo,
          stockAuditDate: $scope.stckaud.auditDate,
          description: $scope.stckaud.description
        });
        // console.log(sendStockAudits);

        sendStockAudits.$save(function(response) {
          // console.log(response);
          $scope.pageChangedStockAudit($scope.searchTextStockAudit.text);
          // $scope.savedStockAuditSuccessfully = true;
          Notification.success('Stock Audit save successfully!');
          $scope.createInventoryActivityForAllComponentSelected(sendStockAudits);
          $scope.errorStockAudit = false;
        }, function(errorResponse) {
          Notification.error(errorResponse);
          $scope.errorStockAudit = errorResponse.data.message;
          $scope.savedStockAuditSuccessfully = '';
        });
      }
    };

    $scope.createInventoryActivityForAllComponentSelected = function(sendStockAudits, callback) {
      /* console.log($scope.randi);
      console.log(sendStockAudits);
      console.log($scope.tempFoodComponentsAdded);*/
      for (var g = 0; g < $scope.tempFoodComponentsAdded.length; g++) {
        for (var b = 0; b < $scope.foodcomponents.length; b++) {
          /* console.log($scope.foodcomponents);
          console.log($scope.foodcomponents[b]._id);
          console.log($scope.tempFoodComponentsAdded[g].foodcomponent);*/
          if ($scope.foodcomponents[b]._id === $scope.tempFoodComponentsAdded[g].foodcomponent._id) {
            $scope.tempFoodComponentsAdded[g].startingStock = $scope.foodcomponents[b].currentStock;
            // console.log($scope.tempFoodComponentsAdded[g].startingStock);
            $scope.tempFoodComponentsAdded[g].endingStock = Number(Number($scope.tempFoodComponentsAdded[g].startingStock - $scope.tempFoodComponentsAdded[g].physicalstock));
            $scope.createFoodInventoryActivity(sendStockAudits, $scope.tempFoodComponentsAdded[g]);
            $scope.updateFoodComponent($scope.tempFoodComponentsAdded[g]);
          }
        }
      }
      if (callback) callback();
    };

    $scope.updateFoodComponent = function(tempFoodComponent) {
      var updateFoodComponents = new FoodComponentService({
        _id: tempFoodComponent.foodcomponent._id,
        currentStock: tempFoodComponent.physicalstock
      });
      updateFoodComponents.$update();
    };

    $scope.createFoodInventoryActivity = function(stockAudits, tempFoodComponent) {
      /* console.log(stockAudits);
      console.log(tempFoodComponent);*/
      var sendInventoryActivitys = new InventoryActivitysService({
        startingStock: tempFoodComponent.startingStock,
        addedOrRemovedStock: tempFoodComponent.physicalstock,
        endingStock: tempFoodComponent.endingStock,
        foodcomponent: tempFoodComponent.foodcomponent,
        activityType: 'Stock Audit Correction',
        stockAudit: stockAudits._id,
        description: tempFoodComponent.description
      });
      // console.log(sendInventoryActivitys);

      sendInventoryActivitys.$save(function(response) {
        // console.log(response);
        $scope.savedInventoryActivitySuccessfully = true;
        $scope.createStockAuditInventoryActivity(stockAudits, sendInventoryActivitys);
        // $scope.clearFoodComValue();
      }, function(errorResponse) {
        $scope.errorInventoryActivity = errorResponse.data.message;
        $scope.savedInventoryActivitySuccessfully = '';
      });
    };

    $scope.createStockAuditInventoryActivity = function(stockAudits, InventoryActivitys) {
      $scope.test1 = 'work';
      /* console.log($scope.test1);
      console.log(stockAudits);
      console.log(InventoryActivitys);*/
      var createStockAuditInventory = new StockAuditInventoryActivitysService({
        stockAudit: stockAudits._id,
        inventoryActivity: InventoryActivitys._id
      });
      createStockAuditInventory.$save(function(response) {
        // console.log(response);
        $scope.savedPurchaseOrderInventorySuccessfully = true;
        $scope.foodcomponents = FoodComponentService.query(function() {
          $scope.appendFoodcomp();
        });
        // StockauditsService.get({ stockauditsId : 'count', stockAuditNumber: searchText });
        $scope.pageChangedStockAudit($scope.searchTextStockAudit.text);
        $scope.tempFoodComponentsAdded = [];
        $scope.clearstckaudValue();
        $scope.getStockAuditNo();
      }, function(errorResponse) {
        $scope.errorPurchaseOrderInventory = errorResponse.data.message;
        $scope.savedPurchaseOrderInventorySuccessfully = '';
      });
    };

			/** **************** function to get stock audit inventory activity   **************** **/

    $scope.getStockAuditInventoryActivityForStockAudit = function(stockAuditId) {
      // console.log(stockAuditId);
      $scope.stockAuditInventoryActivityInStockAudits = StockAuditInventoryActivitysService.query({ stockAudit: stockAuditId });
       // console.log($scope.stockAuditInventoryActivityInStockAudits);
    };
  }
}());
