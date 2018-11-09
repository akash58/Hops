'use strict';

angular.module('foodoperations').controller('foodOperationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'filterFilter', /* 'pageAuthentication', */ 'TablesService', '$http', 'FoodOrdersService', '$q',
  function($scope, $stateParams, $location, Authentication, filterFilter, /* pageAuthentication, */ Tables, $http, FoodOrders, $q) {
    $scope.authentication = Authentication;

    $scope.find = function() {
      // pageAuthentication.shouldRender('Food Operations').then(function(res){
        // $scope.foodOperationsPageVisible=res;
      $scope.foodOperationsPageVisible = true;
      // });
      /* $scope.pages=Pages.query(function(){
        $scope.foodOperationsPageVisible = $scope.shouldRender();
      }); */
      /* $scope.customers = Customers.query(function(){
      $scope.itemsPerPageHardCoded = 10; //hard coded in the current pagination
      $scope.curPageCustomer = {currentPage:1} ;
      $scope.searchTextCust = {text : ''};
      $scope.maxSize = 5;
      $scope.pageChangedCust($scope.searchTextCust.txt);
      $scope.addCustomerclicked = false;
      $scope.savedCustomerSuccessfully = false; */

      // });

      /* $scope.customStyle={};
      $scope.customStyle.colorClass={color:'green'}; */
      $scope.foodorders = FoodOrders.query(function() {
        $scope.foodordersLength = filterFilter($scope.foodorders, { status: 'Ordered' }, true);
        // console.log($scope.foodordersLength);
      });
      /* $scope.tables=Tables.query(function (){
        $scope.getRentalSummary(function() {
          $scope.appendTableSerials();
        });
      }); */

      // $scope.getUnpaidBillSummary();
      // $scope.getFoodOrders();
    };

    $scope.makeFoodOrderServed = function(foodordersToServed) {

      var promises = [];

      for (var b = 0; b < $scope.foodorders.length; b++) {
        if ($scope.foodorders[b].orderTime === foodordersToServed.orderTime) {
          promises.push($scope.updateFoodOrderStatusToServed($scope.foodorders[b]));
        }
      }

      $q.all(promises).then(function() {
        // $scope.find();
        $scope.foodorders = FoodOrders.query(function() {
          $scope.foodordersLength = filterFilter($scope.foodorders, { status: 'Ordered' }, true);
        });
      });

    };

    $scope.updateFoodOrderStatusToServed = function(foodorder) {
      var defer = $q.defer();

      var sendFoodOrder = new FoodOrders({
        _id: foodorder._id,
        status: 'Served'
      });

      sendFoodOrder.$update(function() {
        defer.resolve();
      });

      return defer.promise;
    };

    /* $scope.getGroups = function () {
      $scope.testing='step1';
      var groupArray = [];

      for(var i=0;i<$scope.foodorders.length;i++){
        //for(var j=0;j<$scope.groupArray.length;j++){
          if($scope.foodorders[i].orderTime === groupArray.orderTime){
            groupArray.push($scope.foodorders[i]);
          }
        //}
      }
      return groupArray;
    }; */

    /* $scope.getFoodOrders = function(callback) {
      $http.get('/foodOperations').success(function(data,status){
        $scope.mapReducefoodOrders = data;
        if (callback) callback();
      });
    }; */

    /* $scope.getUnpaidBillSummary = function(callback) {
      $http.get('/getUnpaidBillForOperations').success(function(data,status){
        $scope.unpaidBillsummary = data;
        if (callback) callback();
      });
    }; */

    /* $scope.getRentalSummary = function(callback) {
      $http.get('/rentalsummary').success(function(data,status){
        $scope.rentalsummary = data;
        if (callback) callback();
      });
    }; */

    // $scope.tableClicked = function(table) {
      // ActiveTable.set(table._id);
      // $location.path('/tabledetails');
    // };

/** ********************************* User Role coding  ****************************************/
    /* $scope.shouldRender=function(){
      for (var p in $scope.pages)
        if ($scope.pages[p].pageName === 'Food Operations'){
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
    /* $scope.findOne = function() {
      //$scope.product = Products.get({
        //productId: $stateParams.productId
      //});
    };

    $scope.focusCustomer = function() {
      $scope.errorCustomer = false;
      $scope.savedCustomerSuccessfully = false;
    };

    $scope.focusOnUpdateCustomer = function() {
      $scope.errorCustomer = false;
      $scope.updatedSuccessfullyCustomer = false;
    };

    $scope.clickCustomer= function(customer) {
      if ($scope.activeCustomer === customer.companyName)
          $scope.activeCustomer = '';
      // else {
          // $scope.activeCustomer = customer.companyName;
      }
      $scope.focusCustomer();
      $scope.focusOnUpdateCustomer();
    }; */

    /* $scope.addCustomerbuttonclicked = function() {
      $scope.addCustomerclicked = !$scope.addCustomerclicked;
      $scope.focusCustomer();
    };
     */
/** **********************************************pagination*******************************************************/

    /* $scope.pageChangedCust = function(searchText)   {
      //$scope.searchText = searchText;

          $scope.customersWithSearchTextCustomerId = filterFilter ( $scope.customers, { customerId  : searchText} );
          $scope.customersSearchTextCompyName = filterFilter ( $scope.customers, { companyName :  searchText} );

        for (var i=0; i< $scope.customersWithSearchTextCustomerId.length; i++) {
                if ($scope.customersSearchTextCompyName.indexOf($scope.customersWithSearchTextCustomerId[i])<0) { //element doesn't exist inside '$scope.customersSearchTextCompyName' array
                    $scope.customersSearchTextCompyName.push($scope.customersWithSearchTextCustomerId[i]);
              }
            }
            $scope.totalItemsCustomer = { items : $scope.customersSearchTextCompyName.length};
            $scope.customersOnPage = [];

            $scope.indexStartCust = ($scope.curPageCustomer.currentPage- 1) * $scope.itemsPerPageHardCoded ;
            $scope.indexEndCust = Math.min( ($scope.curPageCustomer.currentPage) * $scope.itemsPerPageHardCoded, $scope.customersSearchTextCompyName.length) ;

      for (i= (($scope.curPageCustomer.currentPage- 1) * $scope.itemsPerPageHardCoded ) ; i < Math.min(($scope.curPageCustomer.currentPage) * $scope.itemsPerPageHardCoded, $scope.customersSearchTextCompyName.length)       ; i++){
            $scope.customersOnPage.push($scope.customersSearchTextCompyName[i]);
      }
      }; */
  }

]);

