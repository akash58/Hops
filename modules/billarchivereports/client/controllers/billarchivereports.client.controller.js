(function () {
  'use strict';

  // Purchase Order controller
  angular
  .module('billarchivereports')
  .controller('BillarchivereportsController', BillarchivereportsController);

  BillarchivereportsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', '$http', 'filterFilter', 'SystemparametersService', 'Billarchives', 'Billrentalarchives', 'Billfoodorderarchives', 'Billgamearchives', 'Billpackageorderarchives', 'Billmembershiparchives', '$q', '$stateParams', '$location', '$timeout'];

  function BillarchivereportsController($scope, $state, $window, Authentication, Notification, $http, filterFilter, SystemparametersService, Billarchives, Billrentalarchives, Billfoodorderarchives, Billgamearchives, Billpackageorderarchives, Billmembershiparchives, $q, $stateParams, $location, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.food = food;

    vm.form = {};

    $scope.initialize = function () {
      $scope.date = new Date();
      $scope.date.setUTCHours(0, 0, 0, 0);
      // $scope.todaysDate();
      // console.log('gdgd');
      $scope.searchTypeSelection = 'searchByBillNumber';
      $scope.billIdArray = [];
      $scope.limit = 10;
      $scope.curPageBillarchive = {
        page: 1
      };
      $scope.maxSize = 5;
      $scope.searchTextBillarchive = {
        text: ''
      };
      $scope.format = 'dd-MMMM-yyyy';
      // console.log('123');
      $scope.pageChangedBillarchives($scope.searchTextBillarchive.text);
      // console.log('456');

      $scope.systemparameters = SystemparametersService.query(function () {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, {
          systemParameterName: 'Currency Symbol'
        }, true)).pop().value;
        $scope.addressOnBill = (filterFilter($scope.systemparameters, {
          systemParameterName: 'Address on Bill'
        }, true)).pop().value;
      });
      // $scope.billFoodOrderArchive='';
    };

    $scope.dateOptions = {
      maxDate: new Date()
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
      $scope.dateOptions.maxDate;
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.getBillsDateWise = function (date) {
      $scope.date.setUTCHours(0, 0, 0, 0);
      // console.log($scope.date);
      Billarchives.get({
        billarchiveId: 'count',
        date: date
      }, function (getBillarchiveCount) {
        $scope.totalItemsBillarchive = /* $scope. */ getBillarchiveCount;
      });
      // console.log('DataWork1');
      $scope.billarchivesOnPage = Billarchives.query({
        page: $scope.curPageBillarchive.page,
        limit: $scope.limit,
        date: date
      }, function (response) {
        // console.log(response);
        $scope.indexStartBillarchive = ($scope.curPageBillarchive.page - 1) * $scope.limit;
        $scope.indexEndBillarchive = Math.min(($scope.curPageBillarchive.page) * $scope.limit, $scope.totalItemsBillarchive.count);
      });
      // console.log($scope.date);
      // if (callback) callback();
    };

    $scope.buildArray = function () {
      for (var i = 0; i < $scope.testBillarchives.length; i++) {
        // $scope.billIdArray.push({bill : $scope.testBillarchives[i].bill});
        $scope.billIdArray.push($scope.testBillarchives[i].bill);
      }
    };

    $scope.getBills = function () {
      Billarchives.get({
        billarchiveId: 'count',
        billNumber: $scope.searchTextBillarchive.text
      }, function (getBillarchiveCount) {
        $scope.totalItemsBillarchive = getBillarchiveCount;
      });

      $scope.billarchivesOnPage = Billarchives.query({
        page: $scope.curPageBillarchive.page,
        limit: $scope.limit,
        billNumber: $scope.searchTextBillarchive.text
      }, function () {
        $scope.indexStartBillarchive = ($scope.curPageBillarchive.page - 1) * $scope.limit;
        $scope.indexEndBillarchive = Math.min(($scope.curPageBillarchive.page) * $scope.limit, $scope.totalItemsBillarchive.count);
      });
    };

    $scope.clickBillarchive = function (billarchive) {
      if ($scope.activeBillarchive === billarchive.billNumber)
        $scope.activeBillarchive = '';
      else {
        $scope.activeBillarchive = billarchive.billNumber;
      }
    };
    /** ******************************************* to get current date ********************************************* **/

/*     $scope.stringifyDate = function (dateFromDB) {
      var dateNeeded = dateFromDB;

      var day = dateNeeded.substring(8, 10);
      var month = dateNeeded.substring(5, 7);
      var year = dateNeeded.substring(0, 4);

      // if (month<10) month = '0' + month;

      var dateString = year + '-' + month + '-' + day;

      return dateString;
    }; */

    /** **********************************************pagination***************************************************** **/

    $scope.pageChangedBillarchives = function (searchText) {
      // $scope.test = 'Work';
      // console.log($scope.date);
      /* $scope.getBillarchiveCount =  */
      Billarchives.get({
        billarchiveId: 'count',
        billNumber: searchText
        // date: $scope.date
      }, function (getBillarchiveCount) {
        $scope.totalItemsBillarchive = /* $scope. */ getBillarchiveCount;
      });
      $scope.billarchivesOnPage = Billarchives.query({
        page: $scope.curPageBillarchive.page,
        limit: $scope.limit,
        billNumber: searchText
        // date: $scope.date
      }, function (response) {
        // console.log(response);
        $scope.indexStartBillarchive = ($scope.curPageBillarchive.page - 1) * $scope.limit;
        $scope.indexEndBillarchive = Math.min(($scope.curPageBillarchive.page) * $scope.limit, $scope.totalItemsBillarchive.count);
      });
    };

    /** ***************************  **************************** **/
    $scope.getBillRentalArchiveForBillArchive = function (billarchive) {
      if ($scope.activeBillarchive === billarchive.billNumber) {
        $scope.BillRentalarchivesInBillArchive = Billrentalarchives.query({
          bill: billarchive.bill
        }, function () {
          for (var q = 0; q < $scope.BillRentalarchivesInBillArchive.length; q++) {
            $scope.getBillRentalArchiveDetails($scope.BillRentalarchivesInBillArchive[q], q);
          }
          billarchive.billTotal = parseFloat(Number(billarchive.billTotal)).toFixed(2);
        });
      }
    };

    $scope.getBillRentalArchiveDetails = function (BillRentalarchivesInBillArchive, q) {
      // $scope.BillRentalarchivesInBillArchive[q]=$scope.getBillFoodOrderArchives($scope.BillRentalarchivesInBillArchive[q]);
      // $scope.BillRentalarchivesInBillArchive[q]=$scope.getBillGameArchives($scope.BillRentalarchivesInBillArchive[q]);
      // $scope.BillRentalarchivesInBillArchive[q]=$scope.packageEffectForRentalArchives($scope.BillRentalarchivesInBillArchive[q]);

      // $scope.BillRentalarchivesInBillArchive[q]=$scope.getBillFoodOrderArchives(BillRentalarchivesInBillArchive,function(){
      // 	$scope.BillRentalarchivesInBillArchive[q]=$scope.getBillGameArchives(BillRentalarchivesInBillArchive,function(){
      // 		$scope.BillRentalarchivesInBillArchive[q]=$scope.packageEffectForRentalArchives(BillRentalarchivesInBillArchive);
      // 	});
      // });

      $scope.getBillFoodOrderArchives(BillRentalarchivesInBillArchive)
      .then($scope.getBillGameArchives)
      .then($scope.packageEffectForRentalArchives)
      .then(function (result) {
        $scope.BillRentalarchivesInBillArchive[q] = result;
      })
      .catch(function (errResponse) {
        $scope.errorMessage = errResponse.data.message;
      });

    };

    /** **************function to get foods from the rentals ************* **/
    $scope.getBillFoodOrderArchives = function (billRentalArchivePass) {

      var defer = $q.defer();

      var billFoodOrderArchive = Billfoodorderarchives.query({
        billRentalArchive: billRentalArchivePass._id
      }, function () {
        billRentalArchivePass.foodordersInBillRentalArchive = billFoodOrderArchive;
        billRentalArchivePass.foodRevenue = parseFloat(Number(billRentalArchivePass.foodRevenue)).toFixed(2);
        billRentalArchivePass.totalOnFood = parseFloat(Number(billRentalArchivePass.totalOnFood)).toFixed(2);
        billRentalArchivePass.totalAmountForCustomer = parseFloat(Number(billRentalArchivePass.totalAmountForCustomer)).toFixed(2);

        for (var a = 0; a < billRentalArchivePass.foodordersInBillRentalArchive.length; a++) {
          billRentalArchivePass.foodordersInBillRentalArchive[a].billPrice = parseFloat(Number(billRentalArchivePass.foodordersInBillRentalArchive[a].billPrice)).toFixed(2);
          billRentalArchivePass.foodordersInBillRentalArchive[a].billCharge = parseFloat(Number(billRentalArchivePass.foodordersInBillRentalArchive[a].billCharge)).toFixed(2);
        }
        defer.resolve(billRentalArchivePass);
      }, function (errResponse) {
        defer.reject(errResponse);
      });
      // if(callback) callback();
      return defer.promise;
    };

    /** ***************************** Function to get games for rental *************************** **/

    $scope.getBillGameArchives = function (billRentalArchivePass) {

      var defer = $q.defer();

      var billGameArchive = Billgamearchives.query({
        billRentalArchive: billRentalArchivePass._id
      }, function () {
        billRentalArchivePass.gamesInBillRentalArchive = billGameArchive;
        billRentalArchivePass.gameRevenue = parseFloat(Number(billRentalArchivePass.gameRevenue)).toFixed(2);
        billRentalArchivePass.totalOnGame = parseFloat(Number(billRentalArchivePass.totalOnGame)).toFixed(2);
        billRentalArchivePass.totalAmountForCustomer = parseFloat(Number(billRentalArchivePass.totalAmountForCustomer)).toFixed(2);

        for (var j = 0; j < billRentalArchivePass.gamesInBillRentalArchive.length; j++) {
          billRentalArchivePass.gamesInBillRentalArchive[j].amountCharged = parseFloat(Number(billRentalArchivePass.gamesInBillRentalArchive[j].amountCharged)).toFixed(2);
        }
        defer.resolve(billRentalArchivePass);
      }, function (errResponse) {
        defer.reject(errResponse);
      });
      // if(callback) callback();
      return defer.promise;
    };
    /** ***************************** Function to get effects of package on rental *************************** **/

    $scope.packageEffectForRentalArchives = function (billRentalArchivePass) {

      var defer = $q.defer();
      billRentalArchivePass.packageQuantityHigherThanOne = false;
      var billPackageOrdeArchive = Billpackageorderarchives.query({
        billRentalArchive: billRentalArchivePass._id
      }, function () {
        billRentalArchivePass.packageordesInBillRentalArchive = billPackageOrdeArchive;
        billRentalArchivePass.packageRevenue = parseFloat(Number(billRentalArchivePass.packageRevenue)).toFixed(2);
        billRentalArchivePass.totalOnPackage = parseFloat(Number(billRentalArchivePass.totalOnPackage)).toFixed(2);
        billRentalArchivePass.totalAmountForCustomer = parseFloat(Number(billRentalArchivePass.totalAmountForCustomer)).toFixed(2);
        defer.resolve(billRentalArchivePass);

        for (var i = 0; i < billRentalArchivePass.packageordesInBillRentalArchive.length; i++) {
          billRentalArchivePass.packageordesInBillRentalArchive[i].billPrice = parseFloat(Number(billRentalArchivePass.packageordesInBillRentalArchive[i].billPrice)).toFixed(2);
          billRentalArchivePass.packageordesInBillRentalArchive[i].billCharge = parseFloat(Number(billRentalArchivePass.packageordesInBillRentalArchive[i].billCharge)).toFixed(2);

          if (billRentalArchivePass.packageordesInBillRentalArchive[i].quantity <= 1) {
            billRentalArchivePass.packageQuantityHigherThanOne = false;
          } else if (billRentalArchivePass.packageordesInBillRentalArchive[i].quantity > 1) {
            billRentalArchivePass.packageQuantityHigherThanOne = true;
          }
        }

      }, function (errResponse) {
        defer.reject(errResponse);
      });
      return defer.promise;
    };

    $scope.billmembershiparchivesForBillarchive = function (billarchive) {
      if ($scope.activeBillarchive === billarchive.billNumber) {
        $scope.billmembershiparchives = Billmembershiparchives.get({
          billArchive: billarchive._id
        }, function () {
          // $scope.billmembershiparchivesInBillarchive = $scope.billmembershiparchives;
          // $scope.billmembershipArchiveAvailable=true;
          if ($scope.billmembershiparchives && Object.keys($scope.billmembershiparchives).length > 2) {

            $scope.billmembershiparchives.membershipactivity.membershipAmount = parseFloat(Number($scope.billmembershiparchives.membershipactivity.membershipAmount)).toFixed(2);
            $scope.billmembershiparchives.membershipactivity.serviceTaxOnMembership = parseFloat(Number($scope.billmembershiparchives.membershipactivity.serviceTaxOnMembership)).toFixed(2);
            $scope.billmembershiparchives.membershipactivity.serviceTaxPercentage = parseFloat(Number($scope.billmembershiparchives.membershipactivity.serviceTaxPercentage)).toFixed(2);
            $scope.billmembershiparchives.membershipactivity.billPrice = parseFloat(Number($scope.billmembershiparchives.membershipactivity.billPrice)).toFixed(2);

            $scope.billmembershipArchiveAvailable = true;
          } else {
            $scope.billmembershipArchiveAvailable = false;
          }
        });
      }
    };

    $scope.clickPrint = function () {
      $window.print();
    };

    $scope.generatedPrintBill = function (billarchive) {
      $scope.billArchiveForGenerationOfPrintout = billarchive;
      // $scope.billRentalForGenerationOfPrintOut = billRentalsInBill;
    };

  }
}());
