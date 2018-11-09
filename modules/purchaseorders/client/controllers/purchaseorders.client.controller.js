(function () {
  'use strict';

  // Purchase Order controller
  angular
    .module('purchaseorders')
    .controller('PurchaseordersController', PurchaseordersController);

  PurchaseordersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'purchaseorderResolve', 'Notification', 'PurchaseordersService', '$http', 'filterFilter', 'SuppliersService', 'PurchaseOrderInventoryActivitysService', 'FoodComponentService', 'SystemparametersService', 'InventoryActivitysService', '$q', '$stateParams', '$location', '$timeout', 'UnitsService'];

  function PurchaseordersController ($scope, $state, $window, Authentication, purchaseorder, Notification, PurchaseordersService, $http, filterFilter, SuppliersService, PurchaseOrderInventoryActivitysService, FoodComponentService, SystemparametersService, InventoryActivitysService, $q, $stateParams, $location, $timeout, UnitsService) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.food = food;
    // vm.test = PurchaseOrderInventoryActivitysService.query();
    // console.log(vm.test);
    vm.form = {};
    // $scope.purchaseOrders = PurchaseordersService.query();

    $scope.initialize = function () {
      $scope.tempFoodComponentAdded = [];

      $scope.ordpurch = { purchaseOrderNo: '', purchaseDate: $scope.todaysDate(), paymentRefferenceNo: '', supplier: '', totalAmount: '', description: '' };
      $scope.foodcom = { foodcomponent: '', quantity: '', price: '', description: '', baseunit: '' };

      $scope.limit = 10; // hard coded in the current pagination
      $scope.curPagePurchaseOrder = { page: 1 };
      $scope.maxSize = 5;
      $scope.searchTextPurchaseOrder = { text: '' };
      $scope.pageChangedPurchaseOrder($scope.searchTextPurchaseOrder.text);
      SystemparametersService.query({ systemParameterName: 'Currency Symbol' }, function (res) {
        // console.log(res);
        $scope.currencySymbol = res.pop().value;
        // console.log($scope.currencySymbol);
      });

      $scope.foodcomponents = FoodComponentService.query(function () {
        $scope.appendPurchaseOrder();
      });
      // $scope.incrementparameters = incrementparameters.query();

      $scope.suppliers = SuppliersService.query();
      $scope.getOrderNo(function () {
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
            // console.log('in1');
          if ($scope.incrementparameters[i].name === 'Purchase Order No.') {
            // console.log('in2');
            $scope.ordpurch.purchaseOrderNo = $scope.incrementparameters[i].value;
            $scope.newpurchaseOrderNo = Number($scope.incrementparameters[i].value) + 1;
            // console.log(Number($scope.incrementparameters[i].value) + 1);
            // console.log('InNew');
            $scope.setIncrementParameter('Purchase Order No.', $scope.newpurchaseOrderNo);
            // console.log('in3');
            break;
          }
        }
      });
    };

    $scope.queryPurchaseOrder = function () {
      $scope.purchaseorders = PurchaseordersService.query();
    };

    $scope.clickPurchaseOrder = function(purchaseorder) {
      if ($scope.activePurchaseOrder === purchaseorder.purchaseOrderNumber) {
        $scope.activePurchaseOrder = '';
      } else {
        // console.log(purchaseorder);
        $scope.activePurchaseOrder = purchaseorder.purchaseOrderNumber;
        $scope.dateofPurchaseString = $scope.stringifyDate(purchaseorder.purchaseDate);
        $scope.getPurchaseOrderInventoryActivityForPurchaseOrder(purchaseorder._id);
      }

    };

		/* $scope.getFoodComponentDetails=function(purchaseorder){
			//$scope.testing=purchaseorder;
			$scope.foodComponentRelatedToPurchaseOrder=[];
			for(var i=0;i<$scope.purchaseorderinventoryactivitys.length;i++){
				if($scope.purchaseorderinventoryactivitys[i].purchaseOrder._id === purchaseorder._id){
					//$scope.foodComponentRelatedToPurchaseOrder = $scope.purchaseorderinventoryactivitys[i];
					$scope.foodComponentRelatedToPurchaseOrder.push($scope.purchaseorderinventoryactivitys[i]);
				}
			}
		}; */
/** *******************  today's date  ******************** **/
    $scope.todaysDate = function () {
      var date = new Date();
      // var dateFormat = date.toLocaleDateString();
     /*  var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      if (month<10) month = '0' + month;
      if (day<10) day = '0' + day;

      var today = year + '-' + month + '-' + day; */
      return date;
    };

    $scope.stringifyDate = function (dateFromDB) {
      var dateNeeded = dateFromDB;

      var day = dateNeeded.substring(8, 10);
      var month = dateNeeded.substring(5, 7);
      var year = dateNeeded.substring(0, 4);

      //  if (month<10) month = '0' + month;

      var dateString = year + '-' + month + '-' + day;

      return dateString;
    };
/** ************************************Get Reference No.Increment****************************************************  **/

    $scope.getPurchaseOrderNo = function() {
    // console.log('called1');
      $scope.getOrderNo(function() {
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.errorPurchaseOrder === false) {
          // console.log('in4');
            if ($scope.incrementparameters[i].name === 'Purchase Order No.') {
            // console.log($scope.incrementparameters[i]);
              $scope.ordpurch.purchaseOrderNo = $scope.incrementparameters[i].value;
              $scope.newpurchaseOrderNo = Number($scope.incrementparameters[i].value) + 1;
              // console.log('in5');
              $scope.setIncrementParameter('Purchase Order No.', $scope.newpurchaseOrderNo);
              // console.log('in6');
              break;
            }
          }
        }
      });
    };

    $scope.setIncrementParameter = function (parameterName, parameterValue) {
      var tempIncrementParameter = {};
      // console.log('in6');
      for (var i = 0; i < $scope.incrementparameters.length; i++) {

        if ($scope.incrementparameters[i].name === parameterName) {
          tempIncrementParameter = $scope.incrementparameters[i];
          // console.log('in7');
          // console.log(tempIncrementParameter);
          break;
        }
      }
      tempIncrementParameter.value = parameterValue;
      // console.log(tempIncrementParameter.value);

      $http.put('/api/incrementparameters/' + tempIncrementParameter._id, tempIncrementParameter);
    };
    $scope.supplierToBeAdded = {
      supplierSelectedItem: '',
      supplierSearchText: '',
      description: ''
    };

    $scope.querySupplier = function(searchText) {
      var deferred = $q.defer();
      SuppliersService.query({ companyName: searchText }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.createSupplier = function() {
      $state.go('suppliers.create');
    };

    $scope.foodComponentToBeAdded = {
      foodComponentSelectedItem: '',
      foodComponentSearchText: '',
      description: ''
    };

    $scope.queryFoodComponent = function(searchText) {
      var deferred = $q.defer();
      FoodComponentService.query({ foodComponentName: searchText }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.createFoodComponent = function() {
      $state.go('foods.component');
    };
 /** *********************************************Get Reference No.***************************************************** **/
    /* $scope.getOrderNo = function(callback) {
      $http.get('api/incrementparameters').success(function(data,status){
        $scope.incrementparameters = data;
        console.log($scope.incrementparameters);
        if (callback) callback();
      });
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

    $scope.pageChangedPurchaseOrder = function(searchText) {
      $scope.getPurchaseOrderCount = PurchaseordersService.get({ purchaseorderId: 'count', searchText: searchText }, function(res) {
        $scope.totalItemsPurchaseOrder = $scope.getPurchaseOrderCount;
        // console.log('work');
        $scope.purchaseOrdersOnPage = PurchaseordersService.query({ page: $scope.curPagePurchaseOrder.page, limit: $scope.limit, searchText: searchText }, function() {
          $scope.indexStart = ($scope.curPagePurchaseOrder.page - 1) * $scope.limit;
          $scope.indexEnd = Math.min(($scope.curPagePurchaseOrder.page) * $scope.limit, $scope.totalItemsPurchaseOrder.count);
        });
      });
    };

/** ***************** Foods ******************************** **/
    $scope.addPurchaseOrderButtonClicked = function() {
      $scope.addPurchaseOrderClicked = !$scope.addPurchaseOrderClicked;
      $scope.focusPurchaseOrder();
			// $scope.focusFoodComponent();
    };

    $scope.addFoodComponentButtonClicked = function() {
      $scope.addFoodComponentClicked = !$scope.addFoodComponentClicked;
      $scope.focusPurchaseOrder();
    };

    $scope.appendPurchaseOrder = function() {
      for (var k = 0; k < $scope.foodcomponents.length; k++)
        $scope.foodcomponents[k].alreadyAdded = false;
    };
/** ******************** add food component in temp food component order array *******************  **/
    $scope.addInTempFoodComponent = function() {
      if ($scope.foodcom.foodcomponent === '') {
        $window.alert('Please select Food Component!/n From the Food component drop down.');
      } else {
        var foodComponentNameAdded = '';
        var amountForFoodcomponentAdded = '';
        var tempID;
        for (var r = 0; r < $scope.foodcomponents.length; r++) {
          if ($scope.foodcomponents[r]._id === $scope.foodcom.foodcomponent._id) {
            foodComponentNameAdded = $scope.foodcomponents[r].foodComponentName;
            $scope.foodcomponents[r].alreadyAdded = true;
            break;
          }
        }

        amountForFoodcomponentAdded = $scope.foodcom.quantity * $scope.foodcom.price;

        $scope.tempFoodComponentAdded.push({
          foodcomponent: $scope.foodcom.foodcomponent,
          foodcomponentname: foodComponentNameAdded,
          quantity: ($scope.foodcom.quantity * $scope.selectedUnit.multiplierWithBaseUnit),
          baseunit: $scope.foodcom.baseunit,
          price: $scope.foodcom.price,
          unitUsedForPrice: $scope.selectedUnit,
          amount: amountForFoodcomponentAdded,
          description: $scope.foodcom.description
        });
        $scope.calculatedTotalAmountForFoodComponent();
        $scope.clearFoodComValue();
      }
    };

    $scope.calculatedTotalAmountForFoodComponent = function() {
      var totalAmountForFoodComponentAdded = 0;
      for (var b = 0; b < $scope.tempFoodComponentAdded.length; b++) {
      // console.log($scope.tempFoodComponentAdded);
        totalAmountForFoodComponentAdded += Number($scope.tempFoodComponentAdded[b].amount);
        // console.log(totalAmountForFoodComponentAdded);
      }
      $scope.ordpurch.totalAmount = totalAmountForFoodComponentAdded;
    };

    $scope.clearFoodComValue = function() {
      $scope.foodcom.foodcomponent = '';
      $scope.foodcom.quantity = '';
      $scope.foodcom.price = '';
      $scope.foodcom.description = '';
    };

    $scope.clearordpurchValue = function() {
      // $scope.ordpurch.purchaseOrderNo='';
      $scope.ordpurch.paymentRefferenceNo = '';
      $scope.ordpurch.supplier = '';
      $scope.ordpurch.totalAmount = '';
      $scope.ordpurch.description = '';
    };

    $scope.focusPurchaseOrder = function() {
      $scope.savedPurchaseOrderSuccessfully = false;
      $scope.errorPurchaseOrder = false;
    };
/** ******************** delete food component in temp food component order array ******************* **/

    $scope.deletedTempFoodComponent = function(foodComponent, callback) {
      $scope.tempFoodComponentAdded.splice($scope.tempFoodComponentAdded.indexOf(foodComponent), 1);
      for (var i = 0; i < $scope.foodcomponents.length; i++) {
        if ($scope.foodcomponents[i]._id === foodComponent.foodcomponent) {
          $scope.foodcomponents[i].alreadyAdded = false;
        }
      }
      if (callback) callback();
    };

    $scope.recalculateTotalAmount = function(foodComponent) {
      $scope.deletedTempFoodComponent(foodComponent, function() {
        $scope.calculatedTotalAmountForFoodComponent();
      });
    };
/** **************** getBaseUnitValue ****************  **/

    $scope.getBaseUnitValue = function(foodComponent) {
      if (foodComponent) {
        $scope.getUnitsForUnitType(foodComponent.baseUnit._id)
          .then(function(unitsInCurrentUnitType) {
            $scope.unitsInCurrentUnitType = unitsInCurrentUnitType;
            $scope.selectedUnitId = foodComponent.baseUnit.baseUnitId;
            // console.log($scope.unitsInCurrentUnitType);
            $scope.unitChanged($scope.selectedUnitId);
          });
      }


      // console.log(foodComponent);
      // if (foodComponent) {
        // for (var r = 0; r < $scope.foodcomponents.length; r++) {
          // if ($scope.foodcomponents[r]._id === foodComponent._id) {
            /* console.log(foodComponent._id);
            console.log($scope.foodcomponents[r]._id);*/
            // $scope.foodcom.baseunit = $scope.foodcomponents[r].baseUnit.baseUnit;
            // console.log($scope.foodcom.baseunit);
          // }
        // }
      // } else {
        // $scope.foodcom.baseunit = '';
      // }
    };

    $scope.unitChanged = function(selectedUnitId) {
      for (var i = 0; i < $scope.unitsInCurrentUnitType.length; i++) {
        if ($scope.unitsInCurrentUnitType[i]._id === selectedUnitId) {
          $scope.selectedUnit = $scope.unitsInCurrentUnitType[i];
          break;
        }
      }
    };
/** **************** function to create a purchase order  ****************  **/

    $scope.createPurchaseOrder = function() {
      if ($scope.ordpurch.totalAmount === '') {
        $window.alert('Please select Food Component within purchase order!\n By clicking plus button to food component.');
      } else if ($scope.ordpurch.supplier === '') {
        $window.alert('Please select Supplier for purchase order !\n From the supplier Drop down.');
      } else if ($scope.tempFoodComponentAdded.length === 0) {
        $window.alert('Please select Food Component within purchase order!\n By clicking plus button to food component.');
      } else {
        var sendpurchaseorders = new PurchaseordersService({
          purchaseOrderNumber: $scope.ordpurch.purchaseOrderNo,
          paymentReferenceNumber: $scope.ordpurch.paymentRefferenceNo,
          purchaseDate: $scope.ordpurch.purchaseDate,
          supplier: $scope.ordpurch.supplier,
          totalAmount: $scope.ordpurch.totalAmount,
          description: $scope.ordpurch.description
        });

        sendpurchaseorders.$save(function(response) {

          vm.foodTypeForm.$setPristine();
          vm.foodTypeForm.selectSupplier.$touched = false;
          vm.foodTypeForm.selectSupplier.$valid = false;
          vm.foodTypeForm.selectFoodComponent.$touched = false;
          vm.foodTypeForm.selectFoodComponent.$valid = false;
          vm.foodTypeForm.rate.$touched = false;
          vm.foodTypeForm.rate.$valid = false;
          vm.foodTypeForm.price.$touched = false;
          vm.foodTypeForm.price.$valid = false;


          // console.log(response);
          // $scope.savedPurchaseOrderSuccessfully = true;
          Notification.success('Purchase Order saved successfully!');
          $scope.pageChangedPurchaseOrder($scope.searchTextPurchaseOrder.text);
          $scope.createInventoryActivityForAllComponentSelected(sendpurchaseorders);
          $scope.errorPurchaseOrder = false;
        }, function(errorResponse) {
          $scope.errorPurchaseOrder = errorResponse.data.message;
          $scope.savedPurchaseOrderSuccessfully = '';
        });
      }
    };

    $scope.createInventoryActivityForAllComponentSelected = function(sendpurchaseorders, callback) {
      // console.log(sendpurchaseorders);
      for (var g = 0; g < $scope.tempFoodComponentAdded.length; g++) {
        // console.log($scope.tempFoodComponentAdded);
        for (var b = 0; b < $scope.foodcomponents.length; b++) {
          // console.log($scope.foodcomponents);
          if ($scope.foodcomponents[b]._id === $scope.tempFoodComponentAdded[g].foodcomponent._id) {
            $scope.tempFoodComponentAdded[g].startingStock = $scope.foodcomponents[b].currentStock;
            $scope.tempFoodComponentAdded[g].endingStock = Number($scope.tempFoodComponentAdded[g].startingStock) + Number($scope.tempFoodComponentAdded[g].quantity);
            $scope.createFoodInventoryActivity(sendpurchaseorders, $scope.tempFoodComponentAdded[g]);
            $scope.updateFoodComponent($scope.tempFoodComponentAdded[g]);
          }
        }
      }
      if (callback) callback();
    };

    $scope.updateFoodComponent = function(tempFoodComponent) {
      var updateFoodComponents = new FoodComponentService({
        _id: tempFoodComponent.foodcomponent._id,
        currentStock: tempFoodComponent.endingStock
      });
      updateFoodComponents.$update(function() {

      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.createFoodInventoryActivity = function(purchaseorders, tempFoodComponent) {
      /* console.log(purchaseorders);
      console.log(tempFoodComponent);*/
      var sendInventoryActivitys = new InventoryActivitysService({
        startingStock: tempFoodComponent.startingStock,
        addedOrRemovedStock: tempFoodComponent.quantity,
        endingStock: tempFoodComponent.endingStock,
        foodcomponent: tempFoodComponent.foodcomponent,
        activityType: 'Purchase Order',
        purchaseOrder: purchaseorders._id,
        //  foodOrder : ,
        //  foodExpiryRecord : ,
        //  stockAudit : ,
        //  previousInventoryActivity : ,
        price: tempFoodComponent.price,
        unitUsedForPrice: tempFoodComponent.unitUsedForPrice._id,
        description: tempFoodComponent.description
      });
      // console.log(sendInventoryActivitys);

      sendInventoryActivitys.$save(function(response) {
        // console.log(response);
        $scope.savedInventoryActivitySuccessfully = true;
        $scope.createPurchaseOrderInventoryActivity(purchaseorders, sendInventoryActivitys);
        $scope.clearFoodComValue();
      }, function(errorResponse) {
        $scope.errorInventoryActivity = errorResponse.data.message;
        $scope.savedInventoryActivitySuccessfully = '';
      });
    };

    $scope.createPurchaseOrderInventoryActivity = function(purchaseorders, InventoryActivitys) {
      var createPurchaseOrderInventory = new PurchaseOrderInventoryActivitysService({
        purchaseOrder: purchaseorders._id,
        inventoryActivity: InventoryActivitys._id
      });
      createPurchaseOrderInventory.$save(function(response) {
        $scope.savedPurchaseOrderInventorySuccessfully = true;
        //  $scope.purchaseorders=PurchaseOrders.query();
        //  $scope.queryPurchaseOrder();
        $scope.foodcomponents = FoodComponentService.query(function() {
          $scope.appendPurchaseOrder();
        });
        $scope.pageChangedPurchaseOrder($scope.searchTextPurchaseOrder.text);
				//  $scope.purchaseorderinventoryactivitys=PurchaseOrderInventoryActivitys.query();
        $scope.tempFoodComponentAdded = [];
        $scope.clearordpurchValue();
        $scope.getPurchaseOrderNo();
      }, function(errorResponse) {
        $scope.errorPurchaseOrderInventory = errorResponse.data.message;
        $scope.savedPurchaseOrderInventorySuccessfully = '';
      });
    };

    // $scope.p = PurchaseOrderInventoryActivitysService.query({ purchaseOrder: purchaseorder._id });

    $scope.getPurchaseOrderInventoryActivityForPurchaseOrder = function(purchaseOrderId) {
      $scope.purchaseOrderInventoryActivityInPurchaseOrders = PurchaseOrderInventoryActivitysService.query({ purchaseOrder: purchaseOrderId });
    };
  }
}());
