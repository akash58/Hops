(function () {
  'use strict';

  // Billdetails controller
  angular
    .module('billdetails')
    .controller('BilldetailsController', BilldetailsController);

  BilldetailsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'RentalsService', 'CustomersService', 'Products', 'TablesService', 'PackagesService', 'UsersService', 'Serials', 'FoodOrdersService', 'FoodsService', 'FoodTypeService', '$log', 'filterFilter', 'BillsService', 'Billrentals', 'SystemparametersService', 'PackageFoodTypeService', 'Billfoodorders', 'Billpackageorders', 'Billgames', 'BillmembershipsService'];

  function BilldetailsController ($scope, $state, $window, Authentication, Rentals, Customers, Products, Tables, Packages, Users, Serials, FoodOrders, Foods, FoodTypes, $log, filterFilter, Bills, Billrentals, SystemParameters, PackageFoodTypes, Billfoodorders, Billpackageorders, Billgames, Billmemberships) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.billdetail = billdetail;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

     /* vm.data = Bills.query();
    console.log(vm.data);*/
    /* vm.data1 = Billrentals.query();
    console.log(vm.data1);*/
    /* vm.data1 = Bills.query();
    console.log(vm.data1);*/
    $scope.initialize = function() {
      $scope.systemparameters = SystemParameters.query(function() {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
        $scope.title = (filterFilter($scope.systemparameters, { systemParameterName: 'Title' }, true)).pop().value;
        $scope.addressOnBill = (filterFilter($scope.systemparameters, { systemParameterName: 'Address on Bill' }, true)).pop().value;
      });
      $scope.bill = { billNumber: '', table: '', attendant: '', dateOfBill: '', tax: '', deposit: '', penaltyCharge: '', rentalCharge: '', totalCharge: '', description: '' };
      /* $scope.pages=Pages.query(function(){
        $scope.billDetailsPageVisible = $scope.shouldRender();
      });*/
      // $scope.billDetailsPageVisible = true;
      $scope.tables = Tables.query();
      $scope.bills = Bills.query();
      $scope.billrentals = Billrentals.query();
      $scope.rentals = Rentals.query();
      $scope.users = Users.query();
      $scope.serials = Serials.query();
      $scope.products = Products.query();
      $scope.foods = Foods.query();
      $scope.foodtypes = FoodTypes.query();
      $scope.packages = Packages.query();
      $scope.packageFoodTypes = PackageFoodTypes.query();
      $scope.billfoodorders = Billfoodorders.query();
      $scope.billpackageorders = Billpackageorders.query();
      $scope.billgames = Billgames.query();
      $scope.billmemberships = Billmemberships.query();
    };
    $scope.stringifyDate = function(dateFromDB) {
      var dateNeeded = dateFromDB;
      // console.log(dateNeeded);
      var day = dateNeeded.substring(8, 10);
      var month = dateNeeded.substring(5, 7);
      var year = dateNeeded.substring(0, 4);
      // if (month<10) month = '0' + month;
      // var dateString = year + '-' + month + '-' + day;
      var dateString = day + '-' + month + '-' + year;
      return dateString;
    };
    /* $scope.shouldRender = function() {
      for (var p in $scope.pages)
        if ($scope.pages[p].pageName === 'Bill Details') {
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
    };*/
    $scope.clickBill = function(bill) {
      if ($scope.activeBill === bill.billNumber)
        $scope.activeBill = '';
      else {
        $scope.activeBill = bill.billNumber;
      // $scope.dateofPurchaseString = $scope.stringifyDate(serial.dateOfPurchase);
      // $scope.dateofExpString = $scope.stringifyDate(serial.dateOfWarrantyExpiry);
      }
    };
    /* $scope.findOne = function() {
    }; */
    /* $scope.getActiveCustomer=function(billrental){
      if($scope.activeCustomerForBill===billrental.rental.customer.companyName)
        $scope.activeCustomerForBill='';
      else{
        $scope.activeCustomerForBill=billrental.rental.customer.companyName;
      }
    }; */
    $scope.getBillRentalForBill = function(bill) {
      $scope.billRentalsInBill = [];
      $scope.working = [];
      // console.log($scope.billrentals);
      for (var a = 0; a < $scope.billrentals.length; a++) {
        // console.log($scope.billrentals[a].bill._id);
        console.log(bill._id);
        if ($scope.billrentals[a].bill._id === bill._id) {
          // $scope.billRentals=$scope.billrentals[a];
          $scope.billRentalsInBill.push($scope.billrentals[a]);
          break;
        }
      }
      for (var q = 0; q < $scope.billRentalsInBill.length; q++) {
        $scope.billRentalsInBill[q] = $scope.getBillFoodOrders($scope.billRentalsInBill[q]);
        $scope.billRentalsInBill[q] = $scope.getBillGames($scope.billRentalsInBill[q]);
        $scope.billRentalsInBill[q] = $scope.packageEffectForRental($scope.billRentalsInBill[q]);
      }
      bill.billTotal = parseFloat(Number(bill.billTotal)).toFixed(2);
    };
    /* function to get foods from the rentals*/
    $scope.getBillFoodOrders = function(billrental) {
      var i = 0;
      var billFoodOrderTemp;
      var currentBillRental = billrental;
      var foodOrdersForBillRental = [];
      for (i = 0; i < $scope.billfoodorders.length; i++) {
        if ($scope.billfoodorders[i].billRental === currentBillRental._id) {
          console.log(i);
          $scope.billfoodorders[i].billPrice = parseFloat(Number($scope.billfoodorders[i].billPrice)).toFixed(2);
          $scope.billfoodorders[i].billCharge = parseFloat(Number($scope.billfoodorders[i].billCharge)).toFixed(2);
          billFoodOrderTemp = $scope.billfoodorders[i];
          foodOrdersForBillRental.push(billFoodOrderTemp);
          break;
        }
      }
      console.log(billrental);
      billrental.foodordersInBillRental = foodOrdersForBillRental;
      billrental.foodRevenue = parseFloat(Number(billrental.foodRevenue)).toFixed(2);
      billrental.totalOnFood = parseFloat(Number(billrental.totalOnFood)).toFixed(2);
      billrental.totalAmountForCustomer = parseFloat(Number(billrental.totalAmountForCustomer)).toFixed(2);
      return billrental;
    };
    /* Function to get games for rental*/
    $scope.getBillGames = function(billrental) {
      var i = 0;
      var billGamesTemp;
      var currentBillRental = billrental;
      var gamesForBillRental = [];
      for (i = 0; i < $scope.billgames.length; i++) {
        if ($scope.billgames[i].billRental === currentBillRental._id) {
          $scope.billgames[i].amountCharged = parseFloat(Number($scope.billgames[i].amountCharged)).toFixed(2);
          billGamesTemp = $scope.billgames[i];
          gamesForBillRental.push(billGamesTemp);
          break;
        }
      }
      billrental.gamesInBillRental = gamesForBillRental;
      billrental.gameRevenue = parseFloat(Number(billrental.gameRevenue)).toFixed(2);
      billrental.totalOnGame = parseFloat(Number(billrental.totalOnGame)).toFixed(2);
      billrental.totalAmountForCustomer = parseFloat(Number(billrental.totalAmountForCustomer)).toFixed(2);
      return billrental;
    };
    /* Function to get effects of package on rental*/
    $scope.packageEffectForRental = function(billrental) {
      var i = 0;
      var BillPackageOrderTemp;
      var currentBillRental = billrental;
      var packageOrdersForBillRentals = [];
      billrental.packageQuantityHigherThanOne = false;
      for (i = 0; i < $scope.billpackageorders.length; i++) {
        if ($scope.billpackageorders[i].billRental === currentBillRental._id) {
          $scope.billpackageorders[i].billPrice = parseFloat(Number($scope.billpackageorders[i].billPrice)).toFixed(2);
          $scope.billpackageorders[i].billCharge = parseFloat(Number($scope.billpackageorders[i].billCharge)).toFixed(2);
          BillPackageOrderTemp = $scope.billpackageorders[i];
          packageOrdersForBillRentals.push(BillPackageOrderTemp);
          if ($scope.billpackageorders[i].quantity <= 1) {
            billrental.packageQuantityHigherThanOne = false;
          } else if ($scope.billpackageorders[i].quantity > 1) {
            billrental.packageQuantityHigherThanOne = true;
          }
        }
      }
      billrental.packageOrdersInBillRental = packageOrdersForBillRentals;
      billrental.packageRevenue = parseFloat(Number(billrental.packageRevenue)).toFixed(2);
      billrental.totalOnPackage = parseFloat(Number(billrental.totalOnPackage)).toFixed(2);
      billrental.totalAmountForCustomer = parseFloat(Number(billrental.totalAmountForCustomer)).toFixed(2);
      return billrental;
    };
    $scope.clickPrint = function() {
      window.print();
    };
    $scope.generatedPrintBill = function(bill, billRentalsInBill) {
      // console.log(bill);
      $scope.billForGenerationOfPrintout = bill;
      // $scope.billRentalForGenerationOfPrintOut = billRentalsInBill;
    };
    /* get MemberShip For Bill [function]*/
    $scope.getMemberShipForBill = function(bill) {
      $scope.memberShipForBill = [];
      // $scope.test=bill;
      // $scope.test=$scope.billmemberships;
      console.log($scope.billmemberships);
      for (var g = 0; g < $scope.billmemberships.length; g++) {
        if ($scope.billmemberships[g].bill._id === bill._id) {
          console.log('FGYYHJJ');

          $scope.memberShipForBill = $scope.billmemberships[g];
          // $scope.memberShipForBill.push($scope.billmemberships[g]);
          $scope.memberShipForBill.membershipactivity.membershipAmount = parseFloat(Number($scope.memberShipForBill.membershipactivity.membershipAmount)).toFixed(2);
          $scope.memberShipForBill.membershipactivity.serviceTaxOnMembership = parseFloat(Number($scope.memberShipForBill.membershipactivity.serviceTaxOnMembership)).toFixed(2);
          $scope.memberShipForBill.membershipactivity.serviceTaxPercentage = parseFloat(Number($scope.memberShipForBill.membershipactivity.serviceTaxPercentage)).toFixed(2);
          $scope.memberShipForBill.membershipactivity.billPrice = parseFloat(Number($scope.memberShipForBill.membershipactivity.billPrice)).toFixed(2);
          $scope.thisBillForMemberShip = true;
          break;
        } else {
          $scope.thisBillForMemberShip = false;
        }
      }
    };
    // Remove existing Billdetail
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.billdetail.$remove($state.go('billdetails.list'));
      }
    }
    // Save Billdetail
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.billdetailForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.billdetail._id) {
        vm.billdetail.$update(successCallback, errorCallback);
      } else {
        vm.billdetail.$save(successCallback, errorCallback);
      }
      function successCallback(res) {
        $state.go('billdetails.view', {
          billdetailId: res._id
        });
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
