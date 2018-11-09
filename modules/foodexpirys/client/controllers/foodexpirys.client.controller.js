'use strict';

angular.module('foodexpirys').controller('FoodExpirysController', ['$scope', '$stateParams', '$location', '$http', 'filterFilter', 'Authentication', 'FoodTypeService', 'FoodsService', /* 'pageAuthentication', */ 'SystemparametersService', 'FoodComponentService', 'InventoryActivitysService', 'FoodExpirys', 'FoodExpiryInventoryActivitys', '$q', '$mdDialog', '$state', 'UnitsService',
  function($scope, $stateParams, $location, $http, filterFilter, Authentication, FoodTypes, Foods, /* pageAuthentication, */ SystemParameters, FoodComponents, InventoryActivitys, FoodExpirys, FoodExpiryInventoryActivitys, $q, $mdDialog, $state, UnitsService) {

    $scope.authentication = Authentication;

    $scope.initialize = function() {
      $scope.tempFoodComponentsAdded = [];
      // $scope.baseunits=BaseUnits.query();
      // pageAuthentication.shouldRender('Food Expirys').then(function(res) {
        // $scope.foodExpiryPageVisible = res;
      $scope.foodExpiryPageVisible = true;
      // });
      /* $scope.pages=Pages.query(function(){
        $scope.foodExpiryPageVisible = $scope.shouldRender();
      }); */
      $scope.fooExp = { foodExpiryNo: '', foodExpiryDate: $scope.todaysDate(), description: '' };
      $scope.expFoodCom = { quantity: '', description: '', baseunit: '' };
      // $scope.clearFoodComponent();

      $scope.foodComponent = { selectedItem: '' };
      $scope.searchText = '';

      $scope.queryFoodComponents = [];

      // $scope.itemsPerPageHardCoded = 10; //hard coded in the current pagination
      // $scope.curPageFoodExpiry = 1;
      // $scope.maxSize = 5;
      // $scope.searchTextFoodExpiry='';
      $scope.limit = 10;
      // hard coded in the current pagination
      $scope.curPageFoodExpiry = { page: 1 };
      $scope.maxSize = 5;
      $scope.searchTextFoodExpiry = { text: '' };

      // $scope.stockaudits=StockAudits.query();
      $scope.foodcomponents = FoodComponents.query(function() {
        $scope.appendFoodComponent();
      });
      // $scope.purchaseorders=PurchaseOrders.query();
      // $scope.queryPurchaseOrder();
      // $scope.purchaseorderinventoryactivitys=PurchaseOrderInventoryActivitys.query();
      // $scope.foodexpiryinventoryactivitys=FoodExpiryInventoryActivitys.query();
      $scope.inventoryactivitys = InventoryActivitys.query();
      // $scope.suppliers=Suppliers.query();
      $scope.queryFoodExpiry();
      $scope.getOrderNo(function() {
        // console.log('$scope.incrementparameters.length: ' + $scope.incrementparameters.length);
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.incrementparameters[i].name === 'Food Expiry No.') {
            // console.log($scope.incrementparameters[i].value);
            $scope.fooExp.foodExpiryNo = $scope.incrementparameters[i].value;
            $scope.newfoodExpiryNo = Number($scope.incrementparameters[i].value) + 1;
            $scope.setIncrementParameter('Food Expiry No.', $scope.newfoodExpiryNo);
            break;
          }
        }
      });
    };

    $scope.createFoodComponent = function() {
      $state.go('foods.component');
    };


    $scope.appendFoodComponent = function() {
      for (var k = 0; k < $scope.foodcomponents.length; k++)
        $scope.foodcomponents[k].alreadyAdded = false;
    };

    $scope.queryFoodExpiry = function() {
      $scope.foodexpirys = FoodExpirys.query(function() {
        $scope.pageChangedFoodExpiry($scope.searchTextFoodExpiry.text);
      });
    };

    $scope.clickFoodExpiry = function(foodexpiry) {
      if ($scope.activeFoodExpiry === foodexpiry.foodExpiryNumber)
        $scope.activeFoodExpiry = '';
      else {
        $scope.getFoodExpiryInventoryActivityForFoodExpiry(foodexpiry._id);
        $scope.activeFoodExpiry = foodexpiry.foodExpiryNumber;
      }

    };

/** ******************* today's date and date related functions **********************/
    $scope.todaysDate = function() {
      var date = new Date();

      /* var day = date.getDate();
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

/** ************************************Get Reference No.Increment******************************************************/

    $scope.getFoodOrderNo = function() {
      $scope.getOrderNo(function() {
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.errorFoodExpiry === false) {

            if ($scope.incrementparameters[i].name === 'Food Expiry No.') {
              $scope.fooExp.foodExpiryNo = $scope.incrementparameters[i].value;
              $scope.newfoodExpiryNo = Number($scope.incrementparameters[i].value) + 1;
              $scope.setIncrementParameter('Food Expiry No.', $scope.newfoodExpiryNo);
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

/** *********************************************Get Reference No.*******************************************************/
    $scope.getOrderNo = function(callback) {
      $http.get('/api/incrementparameters')
        .then(function(data, status) {
          // console.log(data);
          $scope.incrementparameters = data.data;
          // console.log('$scope.incrementparameters: ' + $scope.incrementparameters);
          if (callback) callback();
        });
    };
/** ********************************* User Role coding  ****************************************/
    /* $scope.shouldRender=function(){

      for (var p in $scope.pages)
        if ($scope.pages[p].pageName === 'Food Expirys'){
          $scope.page = $scope.pages[p];
          break;
        }

      for (var i in $scope.authentication.user.roles) {
        for (var j in $scope.page.roles) {

          if ($scope.page.roles[j] === $scope.authentication.user.roles[i]) {
            return true;
          }
        }
      }

      return false;
    }; */
/** ********************************* User Role coding ends  ****************************************/
/** ***********************************  pagination  **********************************************/
    $scope.pageChangedFoodExpiry = function(searchText) {
      /* $scope.foodExpirysWithSearchText = filterFilter ( $scope.foodexpirys, { foodExpiryNumber : searchText } );

      $scope.totalItemsFoodExpiry = $scope.foodExpirysWithSearchText.length;
      $scope.foodExpirysOnPage = [];

      $scope.indexStart = ($scope.curPageFoodExpiry - 1) * $scope.itemsPerPageHardCoded ;
      $scope.indexEnd = Math.min( ($scope.curPageFoodExpiry) * $scope.itemsPerPageHardCoded, $scope.foodExpirysWithSearchText.length) ;

      for ( var i= (($scope.curPageFoodExpiry - 1) * $scope.itemsPerPageHardCoded ) ; i < Math.min(($scope.curPageFoodExpiry) * $scope.itemsPerPageHardCoded, $scope.foodExpirysWithSearchText.length) ; i++){
        $scope.foodExpirysOnPage.push($scope.foodExpirysWithSearchText[i]);
      } */

      FoodExpirys.get({ foodexpiryId: 'count', foodExpiryNumber: searchText }, function(getFoodExpiryCount) {
        $scope.totalItemsFoodExpiry = getFoodExpiryCount;
      });
      $scope.foodExpirysOnPage = FoodExpirys.query({ page: $scope.curPageFoodExpiry.page, limit: $scope.limit, foodExpiryNumber: searchText }, function() {
        $scope.indexStartFoodExpiry = ($scope.curPageFoodExpiry.page - 1) * $scope.limit;
        $scope.indexEndFoodExpiry = Math.min(($scope.curPageFoodExpiry.page) * $scope.limit, $scope.totalItemsFoodExpiry.count);
      });

    };

/** ***************** Foods **********************************/
    $scope.addFoodExpiryButtonClicked = function() {
      $scope.addFoodExpiryClicked = !$scope.addFoodExpiryClicked;
      // $scope.focusPurchaseOrder();
      // $scope.focusFoodComponent();
    };

    $scope.addFoodComponentsButtonClicked = function() {
      $scope.addFoodComponentsClicked = !$scope.addFoodComponentsClicked;
      // $scope.focusPurchaseOrder();
    };

    $scope.queryFoodComponent = function(searchTexts) {
      // console.log(searchTexts);
      var deferred = $q.defer();
      FoodComponents.query({ foodComponentName: searchTexts }, function(results) {
        // console.log(results);
        deferred.resolve(results);
      }, function(err) {
        deferred.reject('Error in connectivity with server! ' + err.data.message);
      });

      return deferred.promise;
    };

    $scope.selectedItemChange = function(item) {
      $scope.queryFoodComponents.push(item);
    };

/** ******************* add food component in temp food component order array *********************/
    $scope.addInTempFoodComponents = function(ev) {
      if ($scope.foodComponent.selectedItem === '') {
        // alert('Please select Food Component!\n From the Food component drop down.');
        // $scope.showAlert = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Please select Food Component!')
            .textContent('Please select a food component from the Food component drop down.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Okay')
            .targetEvent(ev)
        );
      // };
      } else if ($scope.expFoodCom.quantity === '') {
        // alert('Please physical stock observed.');
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Please input quantity!')
            .textContent('Please input quantity of food expired before adding.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Okay')
            .targetEvent(ev)
        );
      } else {

        var foodComponentNameAdded = '';
        // console.log($scope.queryFoodComponents);

        for (var r = 0; r < $scope.queryFoodComponents.length; r++) {
          if ($scope.queryFoodComponents[r] === $scope.foodComponent.selectedItem) {
            foodComponentNameAdded = $scope.queryFoodComponents[r].foodComponentName;
            $scope.queryFoodComponents[r].alreadyAdded = true;
          }
        }
        $scope.tempFoodComponentsAdded.push({
          foodcomponent: $scope.foodComponent.selectedItem,
          foodcomponentname: foodComponentNameAdded,
          quantity: $scope.expFoodCom.quantity * $scope.selectedUnit.multiplierWithBaseUnit,
          baseunit: $scope.foodComponent.selectedItem.baseUnit.baseUnitSymbol,
          description: $scope.expFoodCom.description
        });
        $scope.clearfoodexpirycomValue();
      }
    };

    $scope.clearfoodexpirycomValue = function() {
      $scope.foodComponent.selectedItem = '';
      $scope.expFoodCom.quantity = 0;
      $scope.expFoodCom.description = '';
    };

    $scope.clearfooExpValue = function() {
      $scope.fooExp.description = '';
    };

    $scope.focusPurchaseOrder = function() {
      $scope.savedPurchaseOrderSuccessfully = false;
      $scope.errorPurchaseOrder = false;
    };
/** ******************** delete food component in temp food component order array *********************/
    $scope.deletedTempFoodComponent = function(foodComponent, callback) {
      $scope.tempFoodComponentsAdded.splice($scope.tempFoodComponentsAdded.indexOf(foodComponent), 1);
      if (callback) callback();
    };

/** **************** getBaseUnitValue ******************/

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
/** **************** function to create a food expiry   ******************/
    $scope.createFoodExpiry = function(ev) {
      if ($scope.tempFoodComponentsAdded.length === 0) {
        // alert('Please select Food Component within purchase order!\n By clicking plus button to food component.');
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Please add a Food Component!')
            .textContent('Please add a food component within this purchase order By clicking plus button to add food component.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Okay')
            .targetEvent(ev)
        );
      } else {
        var sendFoodExpirys = new FoodExpirys({
          foodExpiryNumber: $scope.fooExp.foodExpiryNo,
          foodExpiryDate: $scope.fooExp.foodExpiryDate,
          description: $scope.fooExp.description
        });

        sendFoodExpirys.$save(function(response) {

          $scope.savedFoodExpirySuccessfully = true;

          $scope.createInventoryActivityForAllComponentSelected(sendFoodExpirys);
          $scope.errorFoodExpiry = false;
        }, function(errorResponse) {
          $scope.errorFoodExpiry = errorResponse.data.message;
          $scope.savedFoodExpirySuccessfully = '';
        });
        $scope.clearfooExpValue();
      }
    };

    $scope.createInventoryActivityForAllComponentSelected = function(sendFoodExpirys, callback) {

      for (var g = 0; g < $scope.tempFoodComponentsAdded.length; g++) {
        for (var b = 0; b < $scope.queryFoodComponents.length; b++) {
          if ($scope.queryFoodComponents[b] === $scope.tempFoodComponentsAdded[g].foodcomponent) {
            $scope.tempFoodComponentsAdded[g].startingStock = $scope.queryFoodComponents[b].currentStock;
            $scope.tempFoodComponentsAdded[g].endingStock = Number($scope.tempFoodComponentsAdded[g].startingStock) - Number($scope.tempFoodComponentsAdded[g].quantity);
            $scope.createFoodInventoryActivity(sendFoodExpirys, $scope.tempFoodComponentsAdded[g]);
            $scope.updateFoodComponent($scope.tempFoodComponentsAdded[g]);
          }
        }
      }
      if (callback) callback();
    };

    $scope.updateFoodComponent = function(tempFoodComponent) {
      var updateFoodComponents = new FoodComponents({
        _id: tempFoodComponent.foodcomponent._id,
        currentStock: tempFoodComponent.endingStock
      });
      updateFoodComponents.$update();
    };

    $scope.createFoodInventoryActivity = function(foodExpirys, tempFoodComponent) {

      var sendInventoryActivitys = new InventoryActivitys({
        startingStock: tempFoodComponent.startingStock,
        addedOrRemovedStock: tempFoodComponent.quantity,
        endingStock: tempFoodComponent.endingStock,
        foodcomponent: tempFoodComponent.foodcomponent._id,
        activityType: 'Food Expiry',
        foodExpiry: foodExpirys._id,
        // foodOrder : ,
        // foodExpiryRecord : ,
        // stockAudit : ,
        // previousInventoryActivity : ,
        // price : tempFoodComponent.price,
        description: tempFoodComponent.description
      });

      sendInventoryActivitys.$save(function(response) {

        $scope.savedInventoryActivitySuccessfully = true;
        $scope.createFoodExpiryInventoryActivity(foodExpirys, sendInventoryActivitys);
        // $scope.clearFoodComValue();

      }, function(errorResponse) {
        $scope.errorInventoryActivity = errorResponse.data.message;
        $scope.savedInventoryActivitySuccessfully = '';
      });
    };

    $scope.createFoodExpiryInventoryActivity = function(foodExpirys, InventoryActivitys) {
      var createFoodExpiryInventory = new FoodExpiryInventoryActivitys({
        foodExpiry: foodExpirys._id,
        inventoryActivity: InventoryActivitys._id
      });
      createFoodExpiryInventory.$save(function(response) {
        $scope.savedPurchaseOrderInventorySuccessfully = true;
        $scope.foodcomponents = FoodComponents.query(function() {
          $scope.appendFoodComponent();
        });
        // $scope.purchaseorders=PurchaseOrders.query();
        $scope.queryFoodExpiry();
        // $scope.foodexpiryinventoryactivitys=FoodExpiryInventoryActivitys.query();
        $scope.tempFoodComponentsAdded = [];
        $scope.clearfooExpValue();
        $scope.getFoodOrderNo();
      }, function(errorResponse) {
        $scope.errorPurchaseOrderInventory = errorResponse.data.message;
        $scope.savedPurchaseOrderInventorySuccessfully = '';
      });
    };

    /** **************** function to get food expiry inventory activity  ******************/
    $scope.getFoodExpiryInventoryActivityForFoodExpiry = function(foodExpiryId) {
      $scope.foodExpiryInventoryActivityInFoodExpirys = FoodExpiryInventoryActivitys.query({ foodExpiry: foodExpiryId });
    };

  }
]);
