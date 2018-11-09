(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('GenerateBillController', GenerateBillController);

  GenerateBillController.$inject = ['$scope', /* 'tableResolve', */ 'Authentication', 'TablesService', '$mdDialog', '$mdToast', 'CustomersService', '$q', 'RentalsService', 'rentals', 'SystemparametersService', 'rentalsToBeBilled', 'FoodOrdersService', 'billCalcService', '$window', 'BillsService', 'foodOnly', '$http', 'MembershipsService', 'Billrentals', 'Billfoodorders', 'Billpackageorders', 'Billgames', 'MembershipactivitiesService', 'PackageorderService', 'packageorders', 'Serials', 'PackageFoodTypeService'];

  function GenerateBillController($scope, /* tableResolve, */ Authentication, TablesService, $mdDialog, $mdToast, CustomersService, $q, RentalsService, rentals, SystemparametersService, rentalsToBeBilled, FoodOrdersService, billCalcService, $window, BillsService, foodOnly, $http, MembershipsService, Billrentals, Billfoodorders, Billpackageorders, Billgames, MembershipactivitiesService, PackageorderService, packageorders, Serials, PackageFoodTypeService) {
    var vm = this;

    vm.authentication = Authentication;
    /* *************************
    *
    */

/*     $scope.todaysDate = function() {
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;

      var today = year + '-' + month + '-' + day;
      return today;
    }; */

/* ************************* function for initialize *************************** */
    $scope.initialize = function() {
      // console.log(foodOnly);
      $scope.date = new Date();
      $scope.date.setUTCHours(0, 0, 0, 0);
      $scope.rentbill = { billNumber: '', dateOfBill: $scope.date, rentalCharge: '', tax: '', deposit: '', totalCharge: '', description: '', extraCharge: 0, descriptionForExtraCharge: '', descriptionForBill: '', totalOfBill: 0, rounding: 0, discountInpercent: 0, discountInValue: 0 };
      // $scope.systemparameters = SystemparametersService.query();
      $scope.endTimeForActiveRental = new Date();
      // console.log('work1');
      $scope.getRentalsAndOrders(function() {
        $scope.getSystemParameters(function() {
          $scope.setupSystemParameters(function() {
            // console.log('work2');
            $scope.getRentalsToBeBilled(function() {
              // console.log('work3');
              // $scope.checkIfCustomersAreMembers(function(){
              $scope.calculateFoodRevenueForRentals(function() {
                console.log(foodOnly);
                if (!foodOnly) {
                  // console.log('work4');
                  $scope.calculateGameRevenueForRentals(function() {
                    // console.log('work5');
                    $scope.packageEffectForRentals(function() {
                      // console.log('work6');
                      $scope.updateTotal();
                      // console.log('work7');
                    });
                  });
                } else {
                  // $scope.packageEffectForRentals(function() {
                  // console.log('work6');
                  $scope.updateTotal();
                    // console.log('work7');
                  // });
                }
              });
              // console.log('work8');
              $scope.attendant = { _id: $scope.rentalsToBeBilled[0].attendant };
              // console.log('work9');
              // console.log($scope.attendant);
              $scope.table = { _id: $scope.rentalsToBeBilled[0].table._id };
              // });
            });
          });
        });
      });

      $scope.getBillNo(function() {
        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.incrementparameters[i].name === 'Bill Number') {
            $scope.rentbill.billNumber = $scope.incrementparameters[i].value;
            $scope.newPaymentRefNo = Number($scope.incrementparameters[i].value) + 1;
            $scope.setIncrementParameter('Bill Number', $scope.newPaymentRefNo);
            break;
          }
        }
      });
      $scope.printModeForDecs = false;
      $scope.printMode = true;
    };

    $scope.getRentalsAndOrders = function(callback) {
      // $scope.foodorders = rental.foodorders;
      $scope.packageorders = packageorders;
      // $scope.packageFoodTypes = [];
      $scope.foodOnly = foodOnly;
      // $scope.rentals = rental;
      $scope.getFoodOrders()
        .then($scope.getRentals)
        .then($scope.getPackageFoodTypes)
        .then(function() {
          if (callback) callback();
        })
        .catch(function(errResponse) {
          $scope.errorMessage = errResponse.data.message;
        });
      // if (callback) callback();
    };

    $scope.getFoodOrders = function() {
      var deferred = $q.defer();
      FoodOrdersService.query(function(response) {
        $scope.foodorders = response;
        deferred.resolve();
      }, function(err) {
        deferred.reject();
      });
      return deferred.promise;
    };
    $scope.getRentals = function() {
      var deferred = $q.defer();
      RentalsService.query(function(response) {
        $scope.rentals = response;
        deferred.resolve();
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    $scope.getPackageFoodTypes = function() {
      var deferred = $q.defer();
      PackageFoodTypeService.query(function(response) {
        $scope.packageFoodTypes = response;
        deferred.resolve();
      }, function(err) {
        deferred.reject(err);
      });
    };
/* ************************* function to set increment parameter ***************************  */
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
/*  ************************* function to get bill no *************************** */
    $scope.getBillNo = function(callback) {
      // $http.get('/incrementparameters').success(function(data, status) {
      //   $scope.incrementparameters = data;
      //   if (callback) callback();
      // });
      $http.get('/api/incrementparameters').then(function(response) {
        var data = response.data;
        var status = response.status;
        $scope.incrementparameters = data;
        if (callback) callback();
      }, function(err) {
        if (callback) callback();
      });
    };
/*  ************************* function to set up system parameters ***************************  */
    $scope.setupSystemParameters = function(callback) {
      // console.log($scope.systemparameters);
      for (var i = 0; i < $scope.systemparameters.length; i++) {
        if ($scope.systemparameters[i].systemParameterName === 'Vat') {
          $scope.vat = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Service Tax') {
          $scope.serviceTaxParameter = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Game CGST') {
          $scope.gameCgstTaxParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Game SGST') {
          $scope.gameSgstTaxParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Game SAC/HSN Code') {
          $scope.gameHsnParameter = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Food CGST') {
          $scope.foodCgstTaxParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Food SGST') {
          $scope.foodSgstTaxParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Food SAC/HSN Code') {
          $scope.foodHsnParameter = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Package CGST') {
          $scope.packageCgstTaxParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Package SGST') {
          $scope.packageSgstTaxParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Package SAC/HSN Code') {
          $scope.packageHsnParameter = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Service Tax Split') {
          $scope.serviceTaxSplitParameter = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Service Charge') {
          $scope.serviceCharge = Number($scope.systemparameters[i].value);
        } else if ($scope.systemparameters[i].systemParameterName === 'Tax included in price') {
          $scope.taxIncludedInPrice = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Weekend Holiday Today') {
          $scope.isWeekend = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Grace Period') {
          $scope.gracePeriodForGames = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Currency Symbol') {
          $scope.currencySymbol = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Membership Discount Weekend') {
          $scope.weekendMemberShipdiscount = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Membership Discount Weekday') {
          $scope.weekdayMemberShipdiscount = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Address on Bill') {
          $scope.addressOnBill = $scope.systemparameters[i].value;
        } else if ($scope.systemparameters[i].systemParameterName === 'Title') {
          $scope.titleOnBill = $scope.systemparameters[i].value;
        }
      }

      // $scope.serviceTaxRateWithFood = ($scope.serviceTaxParameter * $scope.serviceTaxSplitParameter / 100);
      // $scope.gstRateWithFood = ($scope.foodCgstTaxParameter + $scope.foodSgstTaxParameter / 100);
      console.log($scope.foodCgstTaxParameter);
      console.log($scope.foodSgstTaxParameter);
      console.log($scope.serviceTaxSplitParameter);
      $scope.gstRateWithFood = ($scope.foodCgstTaxParameter + $scope.foodSgstTaxParameter);
      if ($scope.taxIncludedInPrice === 'Y') {
        console.log($scope.gstRateWithFood);
        console.log($scope.serviceCharge);
        console.log($scope.gameCgstTaxParameter);
        console.log($scope.gameSgstTaxParameter);
        $scope.chargeMultiplierWithFood = 1 / ((1 + ($scope.gstRateWithFood / 100)) * (1 + Number($scope.serviceCharge) / 100));
        $scope.chargeMultiplierWithoutFood = 1 / (((1 + ((Number($scope.gameCgstTaxParameter) + Number($scope.gameSgstTaxParameter))) / 100) * (1 + Number($scope.serviceCharge) / 100)));
        console.log('chargeMultiplierWithFood = ' + $scope.chargeMultiplierWithFood);
        console.log($scope.chargeMultiplierWithoutFood);
      } else {
        $scope.chargeMultiplierWithFood = 1;
        $scope.chargeMultiplierWithoutFood = 1;
      }
      if (callback) callback();
    };
/*  ************************* function to calculate food revenue ***************************  */
    $scope.calculateFoodRevenueForRentals = function(callback) {
      // console.log($scope.foodorders);
      if ($scope.foodOnly) {
        $scope.rentbill.totalCharge = 0;
      }
      for (var r = 0; r < $scope.rentalsToBeBilled.length; r++) {
        // console.log($scope.gameCgstTaxParameter);
        $scope.rentalsToBeBilled[r] = billCalcService.getFoodOrders($scope.rentalsToBeBilled[r], $scope.foodorders, $scope.rentals, $scope.chargeMultiplierWithFood, $scope.isWeekend, $scope.weekendMemberShipdiscount, $scope.weekdayMemberShipdiscount, $scope.serviceCharge, $scope.vat, $scope.serviceTaxRateWithFood, $scope.foodCgstTaxParameter, $scope.foodSgstTaxParameter, $scope.gameCgstTaxParameter, $scope.gameSgstTaxParameter);
        if ($scope.foodOnly) {
          // $scope.rentalsToBeBilled[r].totalAmountForCustomer = $scope.rentalsToBeBilled[r].totalOnFood;
          $scope.rentbill.totalCharge = Number($scope.rentbill.totalCharge) + Number($scope.rentalsToBeBilled[r].totalAmountForCustomer);
        }
      }
      if (callback) callback();
    };
/** ************************ function to get system parameters *************************** */
    $scope.getSystemParameters = function(callback) {
      SystemparametersService.query(function(response) {
        $scope.systemparameters = response;
        // console.log(response);
        if (callback) callback();
      }, function(err) {
        // console.log(err);
      });
    };

/** ************************ function to get rental to be build ***************************  */
    $scope.getRentalsToBeBilled = function(callback) {
      // console.log(rentalsToBeBilled);
      $scope.rentalsToBeBilled = rentalsToBeBilled;
      if (callback) callback();
    };

    $scope.checkIfCustomersAreMembers = function(callback) {
      var promises = [];
      for (var i = 0; i < $scope.rentalsToBeBilled.length; i++) {
        promises.push($scope.isCustomerMember(i));
      }
      var allPromise = $q.all(promises);

      allPromise.then(function() {
        if (callback) callback();
      });
    };

    $scope.isCustomerMember = function(i) {
      var defer = $q.defer();

      $scope.checkIfCustomerIsMember($scope.rentalsToBeBilled[i], i, function(returnedResult) {

        $scope.rentalsToBeBilled[i].isMember = returnedResult;
        defer.resolve();

      });
      return defer.promise;
    };

    $scope.checkIfCustomerIsMember = function(rental, i, callback) {

      var returnResult = false;
      var deferred = $q.defer();
      var membership = MembershipsService.get({ customer: rental.customer._id }, function() {

        if (membership && Object.keys(membership).length > 2) {
          var startDate = new Date(membership.membershipStartDate);
          var endMembershipDate = new Date(membership.membershipExpiry);

          if (startDate <= $scope.date && $scope.date <= endMembershipDate) {
            returnResult = true;
            deferred.resolve();
          } else {
            $scope.membershipDateActCheck(membership, function(result) {
            //  //$scope.rentalsToBeBilled[i].isMember = result;

              returnResult = result;
              deferred.resolve();
            });
          }
        } else {
          returnResult = false;
          deferred.resolve();

        }
      });

      deferred.promise.then(function() {
        if (callback) callback(returnResult);
      });
    };

    $scope.membershipDateActCheck = function(membership, callback) {
      console.log('membership date check CALLEd');
      var result = false;
      var membershipActivitiesTemp = MembershipactivitiesService.query({ customerID: membership.customer._id }, function() {
        for (var i = 0; i < membershipActivitiesTemp.length; i++) {
          var startDate = new Date(membershipActivitiesTemp[i].membershipStartDate);
          var endDate = new Date(membershipActivitiesTemp[i].membershipExpiry);
          // var todaysDate = new Date();
          if ($scope.date >= startDate && $scope.date <= endDate) {
            result = true;

            break;
          }
        }
        if (callback) callback(result);
      });
    };

/** *************** function to Query Rental******************* **/
    $scope.queryRental = function(callback) {
      $scope.rentals = RentalsService.query(function() {
        $scope.foodorders = FoodOrdersService.query(function() {
          $scope.packageorders = PackageorderService.query(function() {
            $scope.systemparameters = SystemparametersService.query(function() {
              $scope.setupSystemParameters(function() {
                // var addressOnBill = (filterFilter($scope.systemparameters, {systemParameterName : 'Address on Bill'},true)).pop().value;
                // var titleOnBill = (filterFilter($scope.systemparameters, {systemParameterName : 'Title'},true)).pop().value;
                $scope.appendRentals(function() {
                  if (callback) callback();
                });
              });
              $scope.generateBillAvailable = false;
            });
          });
        });
      });
    };

    $scope.appendRentals = function(callback) {

      var tempStartTime = new Date();
      var tempStartTimeString = '';
      var tempEndTime = new Date();
      var tempEndTimeString = '';
      var k;
      for (var i = 0; i < $scope.rentals.length; i++) {
        tempStartTime = new Date($scope.rentals[i].rentalStart);
        tempStartTimeString = tempStartTime.toLocaleTimeString();
        k = tempStartTimeString.lastIndexOf(':');
        $scope.rentals[i].startTimeString = tempStartTimeString.slice(0, k) + tempStartTimeString.slice(k + 3, tempStartTimeString.length);
      }

      for (var j = 0; j < $scope.rentals.length; j++) {
        tempEndTime = new Date($scope.rentals[j].rentalEnd);
        tempEndTimeString = tempEndTime.toLocaleTimeString();
        k = tempEndTimeString.lastIndexOf(':');
        $scope.rentals[j].endTimeString = tempEndTimeString.slice(0, k) + tempEndTimeString.slice(k + 3, tempEndTimeString.length);
      }

      if (callback) callback();
    };

/* ************************* function to calculate game revenue *************************** */
    $scope.calculateGameRevenueForRentals = function(callback) {
      console.log($scope.chargeMultiplierWithFood);
      for (var r = 0; r < $scope.rentalsToBeBilled.length; r++) {
        $scope.rentalsToBeBilled[r] = billCalcService.getAllRentalsForActiveRental($scope.rentalsToBeBilled[r], $scope.rentals, $scope.gracePeriodForGames, $scope.isWeekend, $scope.chargeMultiplierWithoutFood, $scope.serviceCharge, $scope.serviceTaxParameter, $scope.gameCgstTaxParameter, $scope.gameSgstTaxParameter);
        // console.log($scope.rentalsToBeBilled[r]);
      }
      if (callback) callback();
    };

    $scope.updateTotal = function() {
      // console.log('called3');
      var totalOfBillWithoutRounding = (Number($scope.rentbill.totalCharge) + Number($scope.rentbill.extraCharge) - Number($scope.rentbill.discountInValue)).toFixed(2);
      $scope.rentbill.rounding = parseFloat(Math.round(Number(totalOfBillWithoutRounding)) - Number(totalOfBillWithoutRounding)).toFixed(2);
      $scope.rentbill.totalOfBill = parseFloat((Number($scope.rentbill.totalCharge) + Number($scope.rentbill.extraCharge) + Number($scope.rentbill.rounding)) - Number($scope.rentbill.discountInValue)).toFixed(2);

      $scope.rentbill.extraChargewithDecimal = parseFloat(Number($scope.rentbill.extraCharge) * 100 / 100).toFixed(2);
    };

    $scope.updateTotalForDiscount = function() {
      var totalOfBillWithoutRounding = (Number($scope.rentbill.totalCharge) + Number($scope.rentbill.extraCharge) - Number($scope.rentbill.discountInValue)).toFixed(2);
      $scope.rentbill.rounding = parseFloat(Math.round(Number(totalOfBillWithoutRounding)) - Number(totalOfBillWithoutRounding)).toFixed(2);
      $scope.rentbill.totalOfBill = parseFloat((Number($scope.rentbill.totalCharge) + Number($scope.rentbill.extraCharge) + Number($scope.rentbill.rounding)) - Number($scope.rentbill.discountInValue)).toFixed(2);
      $scope.rentbill.discountInValueWithDecimal = parseFloat(Number($scope.rentbill.discountInValue) * 100 / 100).toFixed(2);
      $scope.rentbill.extraChargewithDecimal = parseFloat(Number($scope.rentbill.extraCharge) * 100 / 100).toFixed(2);
    };
    $scope.updateTotalForDiscountInValue = function() {
      $scope.rentbill.discountInpercent = Math.round(((Number($scope.rentbill.discountInValue) / Number($scope.rentbill.totalCharge)) * 100) * 100) / 100;
      $scope.updateTotalForDiscount();
    };
    $scope.updateTotalForDiscountInPercent = function() {
      $scope.rentbill.discountInValue = Math.round((Number($scope.rentbill.totalCharge * $scope.rentbill.discountInpercent / 100)) * 100) / 100;

      $scope.updateTotalForDiscount();
    };


    $scope.focusBill = function() {
      $scope.errorbill = false;
    };
/*  *******************Generate bill function *********************** */
  // $scope.checkIfRentalAllreadyBilled = function () {

  // };
    $scope.generateBill = function(addBill) {
      console.log(addBill);
      var rentalsAvailable = true;
      $scope.refreshrentals = RentalsService.query(function() {
        for (var j = 0; j < addBill.rentals.length; j++) {
          for (var q = 0; q < $scope.refreshrentals.length; q++) {
            if (addBill.rentals[j]._id === $scope.refreshrentals[q]._id) {
              if ($scope.refreshrentals[q].bill || !$scope.refreshrentals[q].activeRental) {
                rentalsAvailable = false;
                break;
              }
            }
          }
          if (!rentalsAvailable) {
            break;
          }
        }
        if (rentalsAvailable) {
          $scope.generateBill2(addBill);
        } else {
          $scope.errorBill = true;
          // $scope.test='working';
          /* var d = window.confirm('Bill Failed to generate! Because the rental selected are allready Billed.');
              if (d === true){

              }  */

          // $scope.showAlert = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Bill Failed to generate!')
              .textContent('It seems atleast one of the rentals selected has been already Billed or Transfered out of table.')
              .ariaLabel('Alert Dialog Demo')
              .ok('Got it!')
              // .targetEvent(ev)
          );
        }
          // $scope.queryRental(function(){
          //     $scope.queryCustomer();
          // });
      //  }
      });

      // $scope.test = addBill;
    };

    $scope.createBill = function () {
      // console.log($scope.rentbill);
      // console.log($scope.table);
      // console.log($scope.attendant);
      // console.log($scope.rentbill.billNumber);
      var addBill = {
        billNumber: $scope.rentbill.billNumber,
        attendant: $scope.attendant._id || $scope.attendant,
        table: $scope.table._id,
        dateOfBill: $scope.rentbill.dateOfBill,
        // rentalCharge: $scope.rentbill.
        serviceChargeRate: $scope.serviceCharge,
        // vatRate: $scope.vat,
        cgstRateForFood: $scope.foodCgstTaxParameter,
        sgstRateForFood: $scope.foodSgstTaxParameter,
        foodHsnParameter: $scope.foodHsnParameter,
        cgstRateForGame: $scope.gameCgstTaxParameter,
        sgstRateForGame: $scope.gameSgstTaxParameter,
        gameHsnParameter: $scope.gameHsnParameter,
        cgstRateForPackage: $scope.packageCgstTaxParameter,
        sgstRateForPackage: $scope.packageSgstTaxParameter,
        packageHsnParameter: $scope.packageHsnParameter,
        gstRateWithFood: $scope.gstRateWithFood,
        // serviceTaxRate: $scope.serviceTaxParameter,
        // serviceTaxSplitPercent: $scope.serviceTaxSplitParameter,
        rounding: $scope.rentbill.rounding,
        billTotal: $scope.rentbill.totalOfBill,
        extraCharge: $scope.rentbill.extraChargewithDecimal,
        status: 'Billed',
        extraChargeDescription: $scope.rentbill.descriptionForExtraCharge,
        // serviceTaxRateWithFood: $scope.serviceTaxRateWithFood,
        descriptionForBill: $scope.rentbill.descriptionForBill,
        discountInpercent: $scope.rentbill.discountInpercent,
        discountInValue: $scope.rentbill.discountInValueWithDecimal,
        discountDescription: $scope.rentbill.descriptionForDiscount
      };
      addBill.rentals = $scope.rentalsToBeBilled;
      /*  console.log(rentals);
      console.log(rentals[0].serial);
      console.log(rentals[0].serial.renting); */
      $scope.generateBill(addBill);

      // addBill.$save(function(response) {

      //   $mdDialog.hide(addBill);
      // }, function(err) {
      //   $scope.err = err;
      // });
    };

    $scope.generateBill2 = function(addBill) {
      console.log(addBill);
      // $scope.testrentals=addBill;
      // if($scope.rentalBillValidation(addBill)){
      // $scope.testBill=addBill;
      var bill = new BillsService({
        billNumber: addBill.billNumber,
        attendant: addBill.attendant,
        table: addBill.table,
        dateOfBill: addBill.dateOfBill,
        extraCharge: addBill.extraCharge,
        extraChargeDescription: addBill.extraChargeDescription,
        descriptionForBill: addBill.descriptionForBill,
        billTotal: addBill.billTotal,
        status: addBill.status,
        serviceChargeRate: addBill.serviceChargeRate,
        // vatRate: addBill.vatRate,
        cgstRateForFood: addBill.cgstRateForFood,
        sgstRateForFood: addBill.sgstRateForFood,
        foodHsnParameter: addBill.foodHsnParameter,
        cgstRateForGame: addBill.cgstRateForGame,
        gameHsnParameter: addBill.gameHsnParameter,
        sgstRateForGame: addBill.sgstRateForGame,
        cgstRateForPackage: addBill.cgstRateForPackage,
        sgstRateForPackage: addBill.sgstRateForPackage,
        packageHsnParameter: addBill.packageHsnParameter,
        gstRateWithFood: addBill.gstRateWithFood,
        // serviceTaxRate: addBill.serviceTaxRate,
        // serviceTaxSplitPercent: addBill.serviceTaxSplitPercent,
        // serviceTaxRateWithFood: addBill.serviceTaxRateWithFood,
        rounding: addBill.rounding,
        discountInpercent: addBill.discountInpercent,
        discountInValue: addBill.discountInValue,
        discountDescription: addBill.discountDescription
      });
      bill.$save(function(response) {
        $scope.updateRentalActiveAndBillId(bill, addBill);
          // $scope.queryRental();
      }, function(errorResponse) {
        $scope.errorFoodOrder = errorResponse.data.message;
        $scope.savedfoodOrderSuccessfully = '';
      });
    /*  }
      else{
        $scope.errorBill='Rental allready Billed';
      } */
    };


    $scope.updateRentalActiveAndBillId = function(bill, addBill) {
      // $scope.selectedRentals=filterFilter($scope.rentals, { table : {_id : $scope.rent.table }, selected :true });
      $scope.selectedRentals = addBill.rentals;
      for (var i = 0; i < $scope.selectedRentals.length; i++) {
        var currentRental = $scope.selectedRentals[i];
        console.log(currentRental.foodOnly);
        // $scope.updateCurrentRentalEndTime(currentRental);
        var j = 0;
        while (currentRental) {
          if (currentRental.activeRental === true) {
            $scope.updateCurrentRentalEndTime(currentRental, bill);
          } else if (currentRental.activeRental === false) {
            $scope.updateRentalBill(currentRental, bill);
          }

          if (currentRental.renewalRental) {
            for (j = 0; j < $scope.rentals.length; j++) {
              if ($scope.rentals[j]._id === currentRental.renewalRental) {
                currentRental = $scope.rentals[j];
                break;
              }
            }
          } else currentRental = null;
        }

      }
      $scope.generateBillRentalForBill($scope.selectedRentals, bill);

      angular.forEach($scope.selectedRentals, function (rental) {
        rental.selected = false;
        $scope.selectedAll = false;
      });

    };

    $scope.updateRentalBill = function(rental, bill) {
      var updateRental = new RentalsService({
        _id: rental._id,
        bill: bill._id
        // rentalEnd:Date.now()
        // activeRental : false
      });
      updateRental.$update();
    };
/* **************************update selected rentals end time  ********************************** */
    $scope.updateCurrentRentalEndTime = function(rental, bill) {
      var updateCurrentRental = new RentalsService({
        _id: rental._id,
        bill: bill._id,
        rentalEnd: Date.now(),
        activeRental: false
      });
      updateCurrentRental.$update(function (successRes) {
        var totalActiveRentals = 0;
        if (!foodOnly) {
          for (var i = 0; i < rentals.length; i++) {
            console.log(rentals[i].activeRental);
            if (rentals[i]._id === successRes._id) {
              rentals[i].activeRental = successRes.activeRental;
            }
            if (rentals[i].activeRental === false) {
              totalActiveRentals = totalActiveRentals + 1;
            }

          }
          if (totalActiveRentals === rentals.length) {
            rentals[0].serial.renting = false;
          }
          var serial = new Serials(rentals[0].serial);
        // console.log(rentals[0].serial.renting);
          serial.$update();
        }
      }, function (err) {

      });
    };
/** ***********************************post in bill_rental on the creation of the bill*********************************** **/
    $scope.generateBillRentalForBill = function(currentRental, bill) {
      // $scope.selectedRentals=filterFilter($scope.rentals, { table : {_id : $scope.rent.table }, selected :true,activeRental:true });
      $scope.selectedRentals = currentRental;
      for (var i = 0; i < $scope.selectedRentals.length; i++) {
        // var currentRentalForBillRental = $scope.selectedRentals[i];
        $scope.generateBillRental($scope.selectedRentals[i], bill);
      }
    };

    $scope.generateBillRental = function(rental, bill) {
      var sendBillRental = new Billrentals({
        bill: bill._id,
        rental: rental._id,
        deposit: rental.deposit,
        serviceTaxOnFood: rental.serviceTaxOnFood,
        serviceChargeOnFood: rental.serviceChargeOnFood,
        vatOnFood: rental.vatOnFood,
        cgstOnFood: rental.cgstOnFood,
        sgstOnFood: rental.sgstOnFood,
        cgstOnGame: rental.cgstOnGame,
        sgstOnGame: rental.sgstOnGame,
        cgstOnPackage: rental.cgstOnPackage,
        sgstOnPackage: rental.sgstOnPackage,
        serviceTaxOnGame: rental.serviceTaxOnGame,
        serviceChargeOnGame: rental.serviceChargeOnGame,
        serviceTaxForPackage: rental.serviceTaxOnPackage,
        serviceChargeForPackage: rental.serviceChargeOnPackage,
        vatForPackage: rental.vatOnPackage,
        foodRevenue: rental.foodRevenue,
        gameRevenue: rental.gameRevenue,
        packageRevenue: rental.packageRevenue,
        totalOnGame: rental.totalOnGame,
        totalOnFood: rental.totalOnFood,
        totalOnPackage: rental.totalOnPackage,
        subTotalAmountForCustomer: rental.subTotalAmountForCustomer,
        totalAmountForCustomer: rental.totalAmountForCustomer,
        isMember: rental.isMember,
        membershipDiscountPercentage: rental.membershipDiscountPercentage,
        membershipDiscountOnFood: rental.membershipDiscountOnFood
      });
      sendBillRental.$save(function(response) {
        if (!$scope.foodOnly) {
          $scope.createBillFoodOrder(sendBillRental, rental, function() {
            $scope.createBillPackageOrder(sendBillRental, rental, function() {
              $scope.createBillGames(sendBillRental, rental, function() {
                // console.log('Bill_Game : CALLED');
                $scope.queryRental();
              });
            });
            $mdDialog.hide(bill);
          });
        } else {
          // console.log('Bill_Game : CALLED D');
          $scope.createBillFoodOrder(sendBillRental, rental, function() {
            $scope.queryRental();
            $mdDialog.hide(bill);
          });

        }
        // $scope.queryRental();
      }, function(errorResponse) {
        $scope.error = errorResponse;
      });
    };
/* **************************************Create bill food orders  ************************************** */
    $scope.createBillFoodOrder = function(BillRental, rental, callback) {
      $scope.billFoodOrders = rental.foodorders;
      for (var r = 0; r < $scope.billFoodOrders.length; r++) {
        $scope.generateBillFoodOrder($scope.billFoodOrders[r], BillRental);
      }
      if (callback) callback();
    };

    $scope.generateBillFoodOrder = function(foodOrderInBill, BillRental) {

      var sendBillFoodOrder = new Billfoodorders({
        foodOrder: foodOrderInBill._id,
        billRental: BillRental._id,
        food: foodOrderInBill.food._id,
        foodName: foodOrderInBill.food.foodName,
        customer: foodOrderInBill.customer,
        quantity: foodOrderInBill.quantity,
        quantityCharged: foodOrderInBill.quantityCharged,
        billPrice: foodOrderInBill.billPrice,
        billCharge: foodOrderInBill.billCharge
      });
      // $scope.testingBillFoodOrder='working';
      sendBillFoodOrder.$save();
    };
/* **************************************Create bill package orders  ************************************** */
    $scope.createBillPackageOrder = function(BillRental, rental, callback) {
      $scope.billPackageOrders = rental.packageorders;
      // console.log($scope.billPackageOrders);
      if (!$scope.foodOnly) {
        for (var r = 0; r < $scope.billPackageOrders.length; r++) {
          $scope.generateBillPackageOrder($scope.billPackageOrders[r], BillRental);
        }

        if (callback) callback();
      }
    };

    $scope.generateBillPackageOrder = function(packageOrderInBill, BillRental) {

      var sendBillPackageOrder = new Billpackageorders({
        packageOrder: packageOrderInBill._id,
        billRental: BillRental._id,
        package: packageOrderInBill.package._id,
        packageName: packageOrderInBill.package.packageName,
        customer: packageOrderInBill.customer,
        quantity: packageOrderInBill.quantity,
        billPrice: packageOrderInBill.billPrice,
        billCharge: packageOrderInBill.billCharge
      });
      // $scope.testingBillFoodOrder='working';
      sendBillPackageOrder.$save();
    };
/*  **************************************Create bill games  ************************************** */
    $scope.createBillGames = function(BillRental, rental, callback) {
      $scope.billgames = rental.games;
      if (!$scope.foodOnly) {
        for (var r = 0; r < $scope.billgames.length; r++) {
          $scope.generateBillGame($scope.billgames[r], BillRental);
        }
        if (callback) callback();
      }
    };

    $scope.generateBillGame = function(gameInBill, BillRental) {

      var sendBillGame = new Billgames({
        category: gameInBill.category._id,
        categoryName: gameInBill.category.categoryName,
        billRental: BillRental._id,
        noOfMilisecond: gameInBill.noOfMilisecond,
        timePlayed: gameInBill.timePlayed,
        hoursCharged: gameInBill.hoursCharged,
        ratePerHourCharged: gameInBill.ratePerHourCharged,
        amountCharged: gameInBill.amountCharged
      });
      // $scope.testingBillFoodOrder='working';
      sendBillGame.$save();
    };

    $scope.cancelBill = function () {
      $mdDialog.cancel();
    };

    $scope.packageEffectForRentals = function(callback) { // console.log('pck1');
      $scope.rentbill.totalCharge = 0;
      for (var r = 0; r < $scope.rentalsToBeBilled.length; r++) {
        // console.log($scope.rentalsToBeBilled[r]);
        // $scope.rentalsToBeBilled[r].packageorders = [];
        $scope.rentalsToBeBilled[r] = billCalcService.packageEffectForRental($scope.rentalsToBeBilled[r], $scope.packageorders, $scope.rentals, $scope.packageFoodTypes, $scope.chargeMultiplierWithFood, $scope.serviceCharge, $scope.vat, $scope.serviceTaxRateWithFood, $scope.isWeekend, $scope.gracePeriodForGames, $scope.serviceTaxParameter, $scope.endTimeForActiveRental, $scope.packageCgstTaxParameter, $scope.packageSgstTaxParameter, $scope.gameCgstTaxParameter, $scope.gameSgstTaxParameter, $scope.foodCgstTaxParameter, $scope.foodSgstTaxParameter);
        // console.log('pck2');
        console.log($scope.rentalsToBeBilled[r]);
        $scope.rentbill.totalCharge = Number($scope.rentbill.totalCharge) + Number($scope.rentalsToBeBilled[r].totalAmountForCustomer);
        // console.log('pck3');
      }

      if (callback) callback();
    };

    $scope.getActiveCustomer = function(rental) {
      if ($scope.activeCustomerForBill === rental.customer.companyName)
        $scope.activeCustomerForBill = '';
      else {
        $scope.activeCustomerForBill = rental.customer.companyName;
      }
    };

    $scope.printDiv = function() {
      $scope.createBill();
      $window.print();

    };

/*  ***********************************  ************************************ */
    $scope.modeChange = function(callback) {
      $scope.printModeForDecs = true;
      if (callback) callback();
    };

/*  ***********************************  ************************************ */

    $scope.checkNumberOnly = function(e) {
      var a = [];
      var k = e.which;

      for (var i = 48; i < 58; i++)
        a.push(i);

      if (a.indexOf(k) < 0)
        e.preventDefault();
    };
    // $mdDialog.hide(rental);
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
}());
