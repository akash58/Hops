(function () {
  'use strict';

  // payments controller
  angular
  .module('payments')
  .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'paymentResolve', 'PaymentsService', 'Notification', '$http', 'filterFilter', 'SystemparametersService', 'PaymentmodetypesService', 'PaymentBills', 'BillsService', 'FoodOrdersService', 'Foodorderarchives', 'PackageorderService', 'Packageorderarchives', 'Billrentals', 'RentalsService', 'Billarchives', 'Rentalarchives', 'Billrentalarchives', 'Billfoodorders', 'Billfoodorderarchives', 'Billpackageorders', 'Billpackageorderarchives', 'Billgames', 'Billgamearchives', 'TablesService', 'Billmembershiparchives', 'BillmembershipsService', '$q'];

  function PaymentsController($scope, $state, $window, Authentication, payment, Payments, Notification, $http, filterFilter, SystemparametersService, PaymentModeTypes, PaymentBills, Bills, FoodOrders, Foodorderarchives, PackageOrders, Packageorderarchives, Billrentals, Rentals, Billarchives, Rentalarchives, Billrentalarchives, Billfoodorders, Billfoodorderarchives, Billpackageorders, Billpackageorderarchives, Billgames, Billgamearchives, Tables, Billmembershiparchives, Billmemberships, $q) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.stockaudit = stockaudit;
    // vm.error = null;
    // $scope.stockaudits = StockauditsService.query();
    vm.form = {};
    /** **************************************************Initialize************************************************ **/
    $scope.initialize = function () {

      // $scope.users=Users.query();
      $scope.tempBills = [];

      /* $scope.pages=Pages.query(function(){
      $scope.paymentPageVisible = $scope.shouldRender();
      });			 */
      // $scope.payments = Payments.query();
      $scope.limit = 10;
      $scope.curPagePayment = {
        page: 1
      };
      $scope.searchTextPay = {
        text: ''
      };
      $scope.maxSize = 5;
      $scope.pageChangedPay($scope.searchTextPay.txt);
      // $scope.paymentbills = PaymentBills.query();
      $scope.bills = Bills.query(function () {
        $scope.apendbills();
      });
      // $scope.itemsPerPageHardCoded = 10;
      // $scope.curPagePaymentBill = {currentPage:1} ;
      // $scope.searchTextPayBill = {text : ''};
      // $scope.maxSize = 5;
      // $scope.pageChangedPayBill($scope.searchTextPayBill.txt);
      // });
      $scope.pt = {
        paymentModeType: '', /* paymentReceivedBy: $scope.authentication.user._id, */ description: '',
        bill: '',
        paymentReferenceNo: '',
        receivedMoney: '',
        moneyToReturn: ''
      };
      $scope.paymentmodetypes = PaymentModeTypes.query(function () {
        for (var i = 0; i < $scope.paymentmodetypes.length; i++) {
          if ($scope.paymentmodetypes[i].paymentType === 'Cash') {
            $scope.cashPaymentId = $scope.pt.paymentModeType = $scope.paymentmodetypes[i]._id;
            break;
          }
        }
      });
      $scope.systemparameters = SystemparametersService.query(function () {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, {
          systemParameterName: 'Currency Symbol'
        }, true)).pop().value;
        $scope.disablePartialBillCleard();
        $scope.partialPaymentDisabled = (filterFilter($scope.systemparameters, {
          systemParameterName: 'Partial Payment Disabled'
        }, true)).pop().value;
      });
      $scope.rentals = Rentals.query();
      $scope.billrentals = Billrentals.query();
      $scope.billmemberships = Billmemberships.query();
      $scope.billfoodorders = Billfoodorders.query();
      $scope.billpackageorders = Billpackageorders.query();
      $scope.billgames = Billgames.query();
      $scope.foodorders = FoodOrders.query();
      $scope.packageorders = PackageOrders.query();
      $scope.tables = Tables.query();
      $scope.addPaymentModeTypeclicked = false;
      $scope.savedPaymentModeTypeSuccessfully = false;
      $scope.totals = {
        totalPaymentTowardBills: 0
      };
      $scope.getReferenceNo(function () {

        for (var i = 0; i < $scope.incrementparameters.length; i++) {

          if ($scope.incrementparameters[i].name === 'Payment Reference No.') {
            $scope.pt.paymentReferenceNo = $scope.incrementparameters[i].value;
            $scope.newPaymentRefNo = Number($scope.incrementparameters[i].value) + 1;
            $scope.setIncrementParameter('Payment Reference No.', $scope.newPaymentRefNo);
            break;
          }
        }
      });
      $scope.editButtonForCashMode = true;
    };

    /** **********************************************Basic Function********************************************** **/
    $scope.editButtonClicked = function (payment) {
      payment.editButtonClicked = true;
    };

    $scope.findOne = function () {};

    $scope.focusPayment = function () {
      $scope.errorPayment = false;
      $scope.savedPaymentSuccessfully = false;
      $scope.errorPaymentModeTypes = false;
      $scope.errorTempBills = false;
    };

    $scope.addPaymentButtonclicked = function () {
      $scope.addPaymentclicked = !$scope.addPaymentclicked;
      $scope.focusPayment();
      $scope.pt.payment = '';

    };

    $scope.clickPaymentRef = function (payment) {

      if ($scope.activePaymentRef === payment._id)
        $scope.activePaymentRef = '';
      else {
        $scope.activePaymentRef = payment._id;
        $scope.activePaymentReferenceNo = payment.paymentReferenceNo;
        $scope.getPaymentBills(payment);
        $scope.paymentList = {
          paymentModeType: payment.paymentModeType._id
        };
      }
      $scope.focusPayment();

    };

    $scope.getPaymentBills = function (payment) {
      $scope.paymentbills = PaymentBills.query({
        paymentID: payment._id
      });
    };

    $scope.clickPayment = function (paymentbill) {

      if ($scope.activePayment === paymentbill._id)
        $scope.activePayment = '';
      else {
        $scope.activePayment = paymentbill._id;
        $scope.activeBillNumber = paymentbill.billNumber;
      }
      $scope.focusPayment();
    };

    $scope.clearBillForm = function () {
      $scope.totals.totalPaymentTowardBills = 0;
      $scope.pt.description = '';
      $scope.tempBills = [];
    };

    /** **************************************Add More Bill & Temp Bill******************************************* **/
    $scope.addMoreBill = function (billSelected) {
      // $scope.testbill=billSelected;
      $scope.calculatePartialPaymetTowardBill(billSelected).then(function (paymentTowardBill) {
        billSelected.paymentTowardBill = paymentTowardBill;
        var maxPaymentTowardBill = billSelected.paymentTowardBill;
        billSelected.billCleared = true;

        if (billSelected.paymentTowardBill < 0)
          billSelected.isNegative = true;
        else
          billSelected.isNegative = false;

        $scope.addToTempBills(billSelected, maxPaymentTowardBill, function () {
          $scope.apendbills();
        });

        $scope.calculatePaymentTowardBill();
        $scope.pt.bill = '';
      });

    };

    $scope.addToTempBills = function (billSelected, maxPaymentTowardBill, callback) {

      $scope.tempBills.push({
        bill: billSelected,
        maxPaymentTowardBill: maxPaymentTowardBill
      });
      if (callback)
        callback();
    };

    $scope.deleteaddedpayments = function (tempBill) {
      $scope.tempBills.splice($scope.tempBills.indexOf(tempBill), 1);
      $scope.apendbills();
      $scope.pt.bill = '';
    };

    $scope.apendbills = function () {
      // $scope.
      // make all bills false
      for (var k = 0; k < $scope.bills.length; k++) {
        $scope.bills[k].alreadyAddedBill = false;
      }

      // var paymentbillsWithBills = filterFilter ( $scope.paymentbills , {bill : ''});


      for (var i = 0; i < $scope.bills.length; i++) {

        // if bill in tempbill then make it true
        for (var j = 0; j < $scope.tempBills.length; j++) {
          if ($scope.tempBills[j].bill._id === $scope.bills[i]._id) {
            $scope.bills[i].alreadyAddedBill = true;
            // break;
          }
        }
      }

    };

    $scope.calculatePaymentTowardBill = function (callback) {

      $scope.totals.totalPaymentTowardBills = 0;

      for (var i = 0; i < $scope.tempBills.length; i++) {
        if ($scope.tempBills[i].bill.paymentTowardBill) {
          $scope.totals.totalPaymentTowardBills += Number($scope.tempBills[i].bill.paymentTowardBill);
        }
      }

      $scope.pt.moneyToReturn = $scope.moneyToReturn();
      if (callback)
        callback();
    };

    /** ************************************Get Reference No.Increment************************************************* **/
    $scope.getPtReferenceNo = function () {
      $scope.getReferenceNo(function () {

        for (var i = 0; i < $scope.incrementparameters.length; i++) {
          if ($scope.errorPayment === false) {

            if ($scope.incrementparameters[i].name === 'Payment Reference No.') {
              $scope.pt.paymentReferenceNo = $scope.incrementparameters[i].value;
              $scope.newPaymentRefNo = Number($scope.incrementparameters[i].value) + 1;
              $scope.setIncrementParameter('Payment Reference No.', $scope.newPaymentRefNo);
              break;
            }

          }
        }
      });
    };

    $scope.setIncrementParameter = function (parameterName, parameterValue) {
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

    /** *********************************************Get Reference No.*************************************************** **/
    $scope.getReferenceNo = function (callback) {
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

    $scope.disablePartialBillCleard = function () {
      var disableBillCleardSystemParameter = (filterFilter($scope.systemparameters, {
        systemParameterName: 'Partial Payment Disabled'
      }, true)).pop();

      if (disableBillCleardSystemParameter.value === 'Y') {
        $scope.visible = false;
      } else {
        $scope.visible = true;
      }
      // $scope.visible = (disableBillCleardSystemParameter.value === 'Y' ? false : true);

    };

    /** ************************************To Return Cash ***************************************** **/

    $scope.checkIfCashPayment = function () {
      if ($scope.pt.paymentModeType === $scope.cashPaymentId)
        return true;
      else
        return false;
    };

    $scope.moneyToReturn = function () {
      return Math.max(0, ($scope.pt.receivedMoney - $scope.totals.totalPaymentTowardBills));

    };

    /** **********************************************Payment*************************************************** **/

    $scope.createPaymentPrecheck = function (bills) {
      $scope.refreshBills = Bills.query(function () {
        var precheckCleared = true;
        var billIDsArray = [];
        for (var i = 0; i < bills.length; i++) {
          billIDsArray.push(bills[i].bill._id);
          var billFound = false;
          for (var j = 0; j < $scope.refreshBills.length; j++) {
            if (bills[i].bill._id === $scope.refreshBills[j]._id) {
              billFound = true;
              break;
            }
          }

          // makeArray.push(bills[i].bill._id);
          // makeArray.push('0');

          if (!billFound) {
            precheckCleared = false;
            break;
          }

        }

        if (precheckCleared) {

          if ($scope.partialPaymentDisabled === 'Y') {

            $scope.createPayment(bills);
          } else
            $scope.createPaymentPrecheck2(bills, billIDsArray);
        } else
          $scope.errorPayment = 'Please refresh page as a bill has already been paid';
      });
    };

    $scope.createPaymentPrecheck2 = function (bills, billIDsArray) {
      var billsArrayLength = billIDsArray.length;
      // $scope.testing=JSON.stringify(billIDsArray);
      $scope.refreshPaymentBills = PaymentBills.query({
        billID: billIDsArray,
        billsArrayLength: billsArrayLength
      }, function () {

        // $scope.test = $scope.refreshPaymentBills;
        var precheckCleared = true;

        for (var i = 0; i < bills.length; i++) {
          var billRemainingAmountMatched = true;
          for (var j = 0; j < $scope.refreshPaymentBills.length; j++) {
            if ($scope.refreshPaymentBills[j].bill) {
              if (bills[i].bill._id === $scope.refreshPaymentBills[j].bill._id) {
                if (bills[i].maxPaymentTowardBill > $scope.refreshPaymentBills[j].remainingAmount) {
                  billRemainingAmountMatched = false;
                }
              }
            }
          }
          if (!billRemainingAmountMatched) {
            precheckCleared = false;
            break;
          }
        }
        if (precheckCleared)
          $scope.createPayment(bills);
        else
          $scope.errorPayment = 'Please refresh page as a bill has already been partially paid';
      });
    };

    $scope.createPayment = function (bills) {
      if ($scope.pt.paymentModeType === '' || !$scope.pt.paymentModeType)
        $scope.errorPayment = 'Please Select Payment Mode.';
      else if ($scope.tempBills.length === 0)
        $scope.errorPayment = 'Please add bill number to process payment.';
      else {

        for (var m = 0; m < bills.length; m++) {
          if (bills[m].maxPaymentTowardBill === bills[m].bill.paymentTowardBill)
            bills[m].bill.billCleared = true;
        }
        $scope.paybill = bills;

        var payment = new Payments({
          paymentModeType: $scope.pt.paymentModeType,
          paidAmount: $scope.totals.totalPaymentTowardBills,
          // paymentReceivedBy :$scope.pt.paymentReceivedBy,
          description: $scope.pt.description,
          paymentReferenceNo: $scope.pt.paymentReferenceNo
        });

        payment.$save(function (response) {
          $scope.savedPaymentSuccessfully = true;

          for (var i = 0; i < $scope.paybill.length; i++) {
            $scope.createPaymentBill(payment, $scope.paybill[i]); /* .bill */
          }

          $scope.pageChangedPay($scope.searchTextPay.txt);

          // $scope.paymentbills = PaymentBills.query();
          /* $scope.paymentbills = PaymentBills.query( function(){
          $scope.pageChangedPayBill($scope.searchTextPayBill.txt);
          } ); */
          // $scope.billarchives = Billarchives.query();
          $scope.apendbills();
          // for (var i = 0 ; i < $scope.paymentmodetypes.length; i++) {
          // 	if ($scope.paymentmodetypes[i].paymentType === 'Cash' ) {
          // 		$scope.cashPaymentId = $scope.pt.paymentModeType = $scope.paymentmodetypes[i]._id;
          // 		break;
          // 	}
          // }
          $scope.pt.paymentModeType = $scope.cashPaymentId;

        }, function (errorResponse) {

          $scope.errorPayment = errorResponse.data.message;
          $scope.savedPaymentSuccessfully = '';

        });

        $scope.clearBillForm();
        $scope.getPtReferenceNo();
      }

    };

    /** ***********************************************PaymentBill********************************************** **/

    $scope.createPaymentBill = function (payment, passBill) {
      // $scope.testbill=passBill;
      $scope.remainingAmountOfBill = passBill.maxPaymentTowardBill - passBill.bill.paymentTowardBill;
      var paymentbill = new PaymentBills({
        payment: payment._id,
        bill: passBill.bill._id,
        billNumber: passBill.bill.billNumber,
        billTotal: passBill.bill.billTotal,
        remainingAmount: $scope.remainingAmountOfBill,
        billCleared: passBill.bill.billCleared,
        paymentTowardBill: passBill.bill.paymentTowardBill
      });
      // console.log(passBill.bill);
      // console.log(passBill.bill._id);

      paymentbill.$save(function () {
        if (passBill.bill.billCleared)
          $scope.createBillArchive(passBill.bill);
      });
    };

    $scope.calculatePartialPaymetTowardBill = function (bill) {
      var defer = $q.defer();
      $scope.paymentbills = PaymentBills.query({
        billId: bill._id
      }, function () {
        var paymentTowardBill = 0;

        for (var i = 0; i < $scope.paymentbills.length; i++) {
          if ($scope.paymentbills[i].bill) {
            // if($scope.paymentbills[i].bill._id === bill._id){
            if ($scope.paymentbills[i].paymentTowardBill)
              paymentTowardBill += Number($scope.paymentbills[i].paymentTowardBill);
            // }
          }
        }
        var paymentTowardBillValue = bill.billTotal - paymentTowardBill;
        defer.resolve(paymentTowardBillValue);
      }, function (err) {
        defer.reject(err);
      });

      return defer.promise;
    };

    // $scope.calculatePartialPaymetTowardBill = function(bill){
    // 	var a;
    // 	$scope.calculatePartialPaymetTowardBillOnAddBill(bill).then(
    // 		function(paymentTowardBillValue){
    // 			a = paymentTowardBillValue;
    // 	});
    // 	return a;
    // };
    // $scope.calculatePartialPaymetTowardBill = function(bill){
    // 	// var defer=$q.defer();
    // 	// $scope.testing=bill;
    // 	$scope.paymentbills=PaymentBills.query({billId : bill._id,},function(){
    // 		var paymentTowardBill = 0;

    // 		for(var i = 0; i < $scope.paymentbills.length; i++){
    // 			if($scope.paymentbills[i].bill){
    // 				// if($scope.paymentbills[i].bill._id === bill._id){
    // 					if($scope.paymentbills[i].paymentTowardBill)
    // 						paymentTowardBill += Number($scope.paymentbills[i].paymentTowardBill);
    // 				// }
    // 			}
    // 		}
    // 		var paymentTowardBillValue= bill.billTotal - paymentTowardBill;
    // 		 //defer.resolve(paymentTowardBillValue);
    // 	// },function(err){
    // 		// defer.reject(err);

    // 	});
    // 	return paymentTowardBillValue;
    // 	// return defer.promise;
    // };

    /** ********************************************Bill Archive************************************************ **/

    $scope.createBillArchive = function (bill) {

      var billarchive = new Billarchives({
        bill: bill._id,
        billNumber: bill.billNumber,
        table: bill.table._id,
        dateOfBill: bill.dateOfBill,
        extraCharge: bill.extraCharge,
        extraChargeDescription: bill.extraChargeDescription,
        descriptionForBill: bill.descriptionForBill,
        billTotal: bill.billTotal,
        status: bill.status,
        serviceChargeRate: bill.serviceChargeRate,
        cgstRateForFood: bill.cgstRateForFood,
        sgstRateForFood: bill.sgstRateForFood,
        foodHsnParameter: bill.foodHsnParameter,
        cgstRateForGame: bill.cgstRateForGame,
        sgstRateForGame: bill.sgstRateForGame,
        gameHsnParameter: bill.gameHsnParameter,
        cgstRateForPackage: bill.cgstRateForPackage,
        sgstRateForPackage: bill.sgstRateForPackage,
        packageHsnParameter: bill.packageHsnParameter,
        cgstRateForMembership: bill.cgstRateForMembership,
        sgstRateForMembership: bill.sgstRateForMembership,
        membershipHsnParameter: bill.membershipHsnParameter,
        rounding: bill.rounding,
        discountInpercent: bill.discountInpercent,
        discountInValue: bill.discountInValue,
        discountDescription: bill.discountDescription,
        userOrignal: bill.user._id || bill.user,
        createdOrignal: bill.created
      });

      billarchive.$save(function () {
        $scope.deleteBill(bill, billarchive._id);
      });
    };

    $scope.deleteBill = function (bill, billArchiveId) {
      // $scope.test = $scope.billmemberships;
      bill.$remove(function () {

        $scope.bills.splice($scope.bills.indexOf(bill), 1);

        // archive all rentals for that bill
        for (var i = 0; i < $scope.billrentals.length; i++) {
          if ($scope.billrentals[i].bill) {
            if ($scope.billrentals[i].bill._id === bill._id) {
              $scope.archiveRental($scope.billrentals[i].rental, billArchiveId, bill);
            }
          }
        }

        // archive all Membership for that bill
        for (var j = 0; j < $scope.billmemberships.length; j++) {
          if ($scope.billmemberships[j].bill._id === bill._id) {
            $scope.createBillMembershipArchive($scope.billmemberships[j], billArchiveId);
          }
        }

      });

    };

    /** ***********************************************Bill Membership Archive****************************************** **/

    $scope.createBillMembershipArchive = function (billmembership, billArchiveId) {

      var billmembershiparchive = new Billmembershiparchives({
        billmembership: billmembership._id,
        bill: billmembership.bill._id,
        membershipactivity: billmembership.membershipactivity._id,
        billArchive: billArchiveId,
        userOrignal: billmembership.user._id,
        createdOrignal: billmembership.created
      });

      billmembershiparchive.$save(function () {
        billmembership.$remove();
      });
    };

    /* $scope.deleteBillMembership = function(billmembership){

    for (var i = 0; i < $scope.billmemberships.length; i++){
    if($scope.billmemberships[i]._id === billmembership._id){

    billmembership.$remove();
    }
    }
    }; */

    /** *******************************************Rental Archive*********************************************** **/

    $scope.archiveRental = function (rental, billArchiveId, bill /* ,callback */) {

      $scope.createRentalArchive(rental, billArchiveId, bill, true);

      var curRental = {};

      if (rental.renewalRental) {
        for (var i = 0; i < $scope.rentals.length; i++) {
          if ($scope.rentals[i]._id === rental.renewalRental) {
            curRental = $scope.rentals[i];
            break;
          }
        }
      } else
        curRental = null;
      while (curRental) {

        $scope.createRentalArchive(curRental, billArchiveId, bill, false);

        if (curRental.renewalRental) {

          for (var j = 0; j < $scope.rentals.length; j++) {

            if ($scope.rentals[j]._id === curRental.renewalRental) {
              curRental = $scope.rentals[j];
              break;
            }
          }
        } else
          curRental = null;

      }
    };

    $scope.createRentalArchive = function (rental, billArchiveId, bill, activeRental) {

      var rentalarchive = new Rentalarchives({
        // table:
        // customer:
        // attendant:
        // description:
        // foodOnly:
        // deposit:
        rental: rental._id,
        table: rental.table._id || rental.table,
        attendant: rental.attendant._id || rental.attendant,
        // serial: rental.serial._id || rental.serial,
        customer: rental.customer._id,
        rentalPeriod: rental.rentalPeriod,
        rentalStart: rental.rentalStart,
        rentalEnd: rental.rentalEnd,
        deposit: rental.deposit,
        description: rental.description,
        activeRental: rental.activeRental,
        bill: rental.bill._id || rental.bill,
        billArchive: billArchiveId,
        renewalRental: rental.renewalRental || null,
        renewalRentalStart: rental.renewalRentalStart,
        expectedRevenue: rental.expectedRevenue,
        foodOnly: rental.foodOnly,
        userOrignal: rental.user._id || rental.user,
        createdOrignal: rental.created
      });
      if (rental.foodOnly === false) {
        rentalarchive.serial = rental.serial._id || rental.serial;
      }
      rentalarchive.$save(function () {
        $scope.deleteRental(rental, billArchiveId, rentalarchive._id, bill, activeRental);
      });
    };

    $scope.deleteRental = function (rental, billArchiveId, rentalArchiveId, bill, activeRental) {

      for (var i = 0; i < $scope.rentals.length; i++) {
        if ($scope.rentals[i]._id === rental._id) {
          $scope.removeRental($scope.rentals[i], billArchiveId, rentalArchiveId, bill, activeRental);
          break;
        }
      }
    };

    $scope.removeRental = function (rental, billArchiveId, rentalArchiveId, bill, activeRental) {
      rental.$remove(function () {
        $scope.testing = rental;
        if (activeRental === true) {

          // archive all billrental for
          for (var i = 0; i < $scope.billrentals.length; i++) {
            if ($scope.billrentals[i].rental) {
              if ($scope.billrentals[i].rental._id === rental._id) {
                $scope.archiveBillRental($scope.billrentals[i], billArchiveId, rentalArchiveId);
              }
            }
          }

        }
        // archive all foodorders for that rental
        for (var k = 0; k < $scope.foodorders.length; k++) {
          if ($scope.foodorders[k].rental) {
            if ($scope.foodorders[k].rental._id === rental._id) {
              $scope.archiveFoodOrder($scope.foodorders[k], rentalArchiveId, rental);
            }
          }
        }

        // archive all packageorders for that rental
        for (var l = 0; l < $scope.packageorders.length; l++) {
          if ($scope.packageorders[l].rental._id === rental._id) {
            $scope.archivePackageOrder($scope.packageorders[l], rentalArchiveId, rental);
          }
        }
      });
    };

    /** ********************************************Bill Rental Archive*************************************** **/

    $scope.archiveBillRental = function (billrental, billArchiveId, rentalArchiveId) {
      $scope.createBillRentalArchive(billrental, billArchiveId, rentalArchiveId);
    };

    $scope.createBillRentalArchive = function (billrental, billArchiveId, rentalArchiveId) {

      var billrentalarchive = new Billrentalarchives({
        billrental: billrental._id,
        bill: billrental.bill._id,
        rental: billrental.rental._id,
        billArchive: billArchiveId,
        rentalArchive: rentalArchiveId,
        deposit: billrental.deposit,
        serviceChargeOnFood: billrental.serviceChargeOnFood,
        serviceChargeOnGame: billrental.serviceChargeOnGame,
        serviceChargeForPackage: billrental.serviceChargeForPackage,
        foodRevenue: billrental.foodRevenue,
        gameRevenue: billrental.gameRevenue,
        packageRevenue: billrental.packageRevenue,
        cgstOnFood: billrental.cgstOnFood,
        sgstOnFood: billrental.sgstOnFood,
        cgstOnGame: billrental.cgstOnGame,
        sgstOnGame: billrental.sgstOnGame,
        cgstOnPackage: billrental.cgstOnPackage,
        sgstOnPackage: billrental.sgstOnPackage,
        totalOnGame: billrental.totalOnGame,
        totalOnFood: billrental.totalOnFood,
        totalOnPackage: billrental.totalOnPackage,
        subTotalAmountForCustomer: billrental.subTotalAmountForCustomer,
        totalAmountForCustomer: billrental.totalAmountForCustomer,
        isMember: billrental.isMember,
        membershipDiscountPercentage: billrental.membershipDiscountPercentage,
        membershipDiscountOnFood: billrental.membershipDiscountOnFood,
        userOrignal: billrental.user._id,
        createdOrignal: billrental.created
      });

      billrentalarchive.$save(function () {
        $scope.deleteBillRental(billrental, billrentalarchive._id);
      });
    };

    $scope.deleteBillRental = function (billrental, billRentalArchiveId) {

      for (var i = 0; i < $scope.billrentals.length; i++) {
        if ($scope.billrentals[i]._id === billrental._id) {

          $scope.removeBillRental($scope.billrentals[i], billRentalArchiveId);
        }
      }
    };

    $scope.removeBillRental = function (billrental, billRentalArchiveId) {

      billrental.$remove(function () {

        $scope.billrentals.splice($scope.billrentals.indexOf(billrental), 1);

        // archive all billfoodorders for that bill
        for (var j = 0; j < $scope.billfoodorders.length; j++) {
          if ($scope.billfoodorders[j].billRental === billrental._id) {
            $scope.archiveBillFoodOrder($scope.billfoodorders[j], billRentalArchiveId, billrental);
          }
        }
        // archive all billpackageorders for that bill

        for (var i = 0; i < $scope.billpackageorders.length; i++) {
          if ($scope.billpackageorders[i].billRental === billrental._id) {
            $scope.archiveBillPackageOrder($scope.billpackageorders[i], billRentalArchiveId, billrental);
          }
        }
        // archive all billgames for that bill

        for (var k = 0; k < $scope.billgames.length; k++) {
          if ($scope.billgames[k].billRental === billrental._id) {
            $scope.archiveBillGames($scope.billgames[k], billRentalArchiveId, billrental);
          }
        }

        $scope.clearTable(function () {
          $scope.tables = Tables.query();
          // $scope.updateSerial(billrental);
        });
      });
    };

    $scope.updateSerial = function(billrental) {
      billrental.rental.serial.renting = false;

      billrental.rental.serial.$update();

    };

    /** *********************************************Bill Foodorder Archive*************************************** **/

    $scope.archiveBillFoodOrder = function (billFoodOrder, billRentalArchiveId, billrental) {
      $scope.createBillFoodOrderArchive(billFoodOrder, billRentalArchiveId, billrental);
    };

    $scope.createBillFoodOrderArchive = function (billFoodOrder, billRentalArchiveId, billrental) {

      var billfoodorderarchive = new Billfoodorderarchives({
        billFoodOrder: billFoodOrder._id,
        billrental: billrental._id,
        billRentalArchive: billRentalArchiveId,
        foodName: billFoodOrder.foodName,
        customer: billFoodOrder.customer,
        quantity: billFoodOrder.quantity,
        quantityCharged: billFoodOrder.quantityCharged,
        billPrice: billFoodOrder.billPrice,
        billCharge: billFoodOrder.billCharge,
        userOrignal: billFoodOrder.user._id,
        createdOrignal: billFoodOrder.created
      });

      billfoodorderarchive.$save(function () {
        $scope.deleteBillFoodOrder(billFoodOrder);
      });
    };

    $scope.deleteBillFoodOrder = function (billFoodOrder) {
      billFoodOrder.$remove(function () {
        $scope.billfoodorders.splice($scope.billfoodorders.indexOf(billFoodOrder), 1);
      });
    };

    /** *********************************************Bill Package Order Archive*************************************** **/
    $scope.archiveBillPackageOrder = function (billPackageOrder, billRentalArchiveId, billrental) {
      $scope.createBillPackageOrderArchive(billPackageOrder, billRentalArchiveId, billrental);
    };

    $scope.createBillPackageOrderArchive = function (billPackageOrder, billRentalArchiveId, billrental) {
      var billpackageorderarchive = new Billpackageorderarchives({
        billPackageorder: billPackageOrder._id,
        billrental: billrental._id,
        billRentalArchive: billRentalArchiveId,
        packageName: billPackageOrder.packageName,
        customer: billPackageOrder.customer,
        quantity: billPackageOrder.quantity,
        quantityCharged: billPackageOrder.quantityCharged,
        billPrice: billPackageOrder.billPrice,
        billCharge: billPackageOrder.billCharge,
        userOrignal: billPackageOrder.user._id,
        createdOrignal: billPackageOrder.created
      });

      billpackageorderarchive.$save(function () {
        $scope.deleteBillPackageOrder(billPackageOrder);
      });
    };

    $scope.deleteBillPackageOrder = function (billPackageOrder) {
      billPackageOrder.$remove(function () {
        // $scope.billfoodorders.splice($scope.billpackageorders.indexOf(billPackageOrder), 1 );
        $scope.billpackageorders.splice($scope.billpackageorders.indexOf(billPackageOrder), 1);
      });
    };
    /** *********************************************Bill Game Archive*************************************** **/
    $scope.archiveBillGames = function (billGame, billRentalArchiveId, billrental) {
      $scope.createBillGameArchive(billGame, billRentalArchiveId, billrental);
    };

    $scope.createBillGameArchive = function (billGame, billRentalArchiveId, billrental) {
      var billgamearchive = new Billgamearchives({
        billGame: billGame._id,
        category: billGame.category,
        billRental: billrental._id,
        billRentalArchive: billRentalArchiveId,
        categoryName: billGame.categoryName,
        noOfMilisecond: billGame.noOfMilisecond,
        timePlayed: billGame.timePlayed,
        hoursCharged: billGame.hoursCharged,
        ratePerHourCharged: billGame.ratePerHourCharged,
        amountCharged: billGame.amountCharged,
        userOrignal: billGame.user._id,
        createdOrignal: billGame.created
      });

      billgamearchive.$save(function () {
        $scope.deleteBillGames(billGame);
      });
    };

    $scope.deleteBillGames = function (billGame) {
      billGame.$remove(function () {
        $scope.billgames.splice($scope.billgames.indexOf(billGame), 1);
      });
    };

    /** ****************************************Food Order Archive************************************************** **/

    $scope.archiveFoodOrder = function (foodOrder, rentalArchiveId, rental) {
      $scope.createFoodOrderArchive(foodOrder, rentalArchiveId, rental);
    };

    $scope.createFoodOrderArchive = function (foodOrder, rentalArchiveId, rental) {
      console.log(foodOrder);
      var foodorderarchive = new Foodorderarchives({
        foodOrder: foodOrder._id,
        rental: rental._id,
        rentalarchive: rentalArchiveId,
        food: foodOrder.food._id,
        customer: foodOrder.customer,
        quantity: foodOrder.quantity,
        orderTime: foodOrder.orderTime,
        userOrignal: foodOrder.user._id || foodOrder.user,
        createdOrignal: foodOrder.created
      });

      foodorderarchive.$save(function () {
        $scope.deleteFoodOrder(foodOrder);
      });
    };

    $scope.deleteFoodOrder = function (foodOrder) {
      foodOrder.$remove(function () {
        $scope.foodorders.splice($scope.foodorders.indexOf(foodOrder), 1);
      });
    };

    /** **************************************Package Order Archive*************************************** **/

    $scope.archivePackageOrder = function (packageOrder, rentalArchiveId, rental) {
      $scope.createPackageOrderArchive(packageOrder, rentalArchiveId, rental);
    };

    $scope.createPackageOrderArchive = function (packageOrder, rentalArchiveId, rental) {

      var packageorderarchive = new Packageorderarchives({
        packageOrder: packageOrder._id,
        rental: rental._id,
        rentalarchive: rentalArchiveId,
        package: packageOrder.package._id,
        customer: packageOrder.customer,
        userOrignal: packageOrder.user._id,
        createdOrignal: packageOrder.created
      });
      packageorderarchive.$save(function () {
        $scope.deletePackageOrder(packageOrder);
      });
    };

    $scope.deletePackageOrder = function (packageOrder) {
      packageOrder.$remove(function () {
        $scope.packageorders.splice($scope.packageorders.indexOf(packageOrder), 1);
      });
    };

    /** **********************************************Clear Table************************************************* **/

    $scope.clearTable = function (callback) {

      for (var i = 0; i < $scope.tables.length; i++) {
        $scope.tables[i].busy = false;
        for (var j = 0; j < $scope.rentals.length; j++) {
          if ($scope.rentals[j].table._id === $scope.tables[i]._id) {
            $scope.tables[i].busy = true;
            break;
          }
        }
      }

      for (var k = 0; k < $scope.tables.length; k++) {
        if ($scope.tables[k].busy === false && $scope.tables[k].status !== 'available') {
          $scope.uptadeTable($scope.tables[k]._id);
        }
      }
      if (callback)
        callback();
    };

    $scope.uptadeTable = function (tableId) {
      var sendTableUpdate = new Tables({
        _id: tableId,
        status: 'available',
        currentAttendant: null,
        serial: null
      });

      sendTableUpdate.$update();

    };

    /*		This function is get called when, an edit button to edit cash mode for payment gets clicked
     */
    $scope.editButtonForCashModeGetClicked = function (payment) {
      $scope.editButtonForCashMode = !$scope.editButtonForCashMode;
      // $scope.paymentList={paymentModeType:payment.paymentModeType._id};
    };

    /*		This function called to update the payment cash mode type for the selected payments
    in the client view / simply in the browser.
     */

    $scope.updateCashModeTypeForPayments = function (payment) {

      var sendUpdatedPaymentModeType = new Payments({
        _id: payment._id,
        paymentModeType: $scope.paymentList.paymentModeType
      });

      sendUpdatedPaymentModeType.$update(function () {
        $scope.PaymentModeTypeUpdatedSuccessfully = true;
        $scope.editButtonForCashMode = true;
        // $scope.testingUpdateButton=sendUpdatedPaymentModeType;
        // $scope.paymentList.paymentModeType =
        payment.paymentModeType._id = sendUpdatedPaymentModeType.paymentModeType;
        $scope.paymentList.paymentModeType = sendUpdatedPaymentModeType.paymentModeType;
        $window.alert('Payments mode type updated successfully');
        // if (callback) callback();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // $scope.testingUpdateButton='called';
    };

    /** ****************************************pagination for Payment No.***************************************** **/

    $scope.pageChangedPay = function (searchText) {

      $scope.getPaymentCount = Payments.get({
        paymentId: 'count',
        paymentReferenceNo: searchText
      }, function () {
        $scope.totalItemsPayment = $scope.getPaymentCount;
        // console.log('WorK');
        $scope.paymentsOnPage = Payments.query({
          page: $scope.curPagePayment.page,
          limit: $scope.limit,
          paymentReferenceNo: searchText
        }, function () {
          $scope.indexStartPay = ($scope.curPagePayment.page - 1) * $scope.limit;
          $scope.indexEndPay = Math.min(($scope.curPagePayment.page) * $scope.limit, $scope.totalItemsPayment.count);
        });
      });

      /* $scope.paymentsWithSearchText = filterFilter ( $scope.payments, { paymentReferenceNo : searchText  } );
      //$scope.paymentWithBillNo = filterFilter ( $scope.paymentbills, { billNumber : searchText  } );

      $scope.totalItemsPayment = { items : $scope.paymentsWithSearchText.length};
      $scope.paymentsOnPage = [];

      $scope.indexStartPay = ($scope.curPagePayment.currentPage- 1) * $scope.itemsPerPageHardCoded ;
      $scope.indexEndPay = Math.min( ($scope.curPagePayment.currentPage) * $scope.itemsPerPageHardCoded, $scope.paymentsWithSearchText.length) ;

      for ( var i= (($scope.curPagePayment.currentPage- 1) * $scope.itemsPerPageHardCoded ) ; i < Math.min(($scope.curPagePayment.currentPage) * $scope.itemsPerPageHardCoded, $scope.paymentsWithSearchText.length) ; i++){
      $scope.paymentsOnPage.push($scope.paymentsWithSearchText[i]);
      } */
    };

    /** ********************************************************************************************************** **/
    /* $scope.pageChangedPayBill = function(searchText){
    $scope.test1 = 'work';
    $scope.paymentWithBillNo = filterFilter ( $scope.paymentbills, { billNumber : searchText  } );
    $scope.test2 ='Fine';
    $scope.totalItemsPaymentBill = { items : $scope.paymentWithBillNo.length};
    $scope.test3 ='Hi';
    $scope.paymentBillsOnPage = [];

    $scope.test4 ='Hi5';

    for ( var i= (($scope.curPagePaymentBill.currentPage- 1) * $scope.itemsPerPageHardCoded ) ; i < Math.min(($scope.curPagePaymentBill.currentPage) * $scope.itemsPerPageHardCoded, $scope.paymentWithBillNo.length) ; i++){
    $scope.paymentBillsOnPage.push($scope.paymentWithBillNo[i]);
    }
    $scope.test5 ='Hi6';
    };	 */

  }
}());
