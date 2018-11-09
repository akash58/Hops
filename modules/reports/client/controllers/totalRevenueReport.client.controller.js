(function () {
  'use strict';

  angular
    .module('reports')
    .controller('TotalRevenueReportController', TotalRevenueReportController);

  TotalRevenueReportController.$inject = ['$scope', '$http', 'Authentication', 'TablesService', 'SystemparametersService', 'filterFilter', '$location', '$state'];

  function TotalRevenueReportController($scope, $http, Authentication, Tables, SystemParameters, filterFilter, $location, $state) {
    var vm = this;

    vm.authentication = Authentication;

    $scope.initialize = function() {

      /* pageAuthentication.shouldRender('Daily Report').then(function(res){
        $scope.revenueReportPageVisible=res;
      });
       $scope.pages = Pages.query(function(){
        $scope.revenueReportPageVisible= $scope.shouldRender();
      });*/

      $scope.systemparameters = SystemParameters.query(function() {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
      });

      $scope.todaysDate(function() {
        $scope.getRevenueDetailsFromBillRentalArchives(function() {
          $scope.getMembershipRevenueDateWise(function() {
            $scope.getBillRevenueDateWise(function() {
              $scope.convertMembershipRevenueInToFixed(function() {
                $scope.convertRevenueDetailsFromBillRentalArchivesInToFixed(function() {
                  $scope.convertTotalRevenueInToFixed(function() {
                    $scope.getTotalRevenueForPaymentTypeDateWise(function() {
                      $scope.convertTotalRevenueForPaymentTypeInToFixed(function() {

                        if ($scope.revenueDetailsFromBillRentalArchives.deposit === null) {
                          $scope.revenueDetailsFromBillRentalArchives.deposit = 0;
                        }

                        $scope.revenueDetailsFromBillRentalArchives.deposit = $scope.revenueDetailsFromBillRentalArchives.deposit.toLocaleString('en-IN', { minimumFractionDigits: 2 });

                        $scope.totalRevenue.billTotal = parseFloat(Number($scope.totalRevenue.billTotal.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.deposit.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

                        $scope.totalpaymentType = parseFloat(Number($scope.totalpaymentType.toString().replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.deposit.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

                      });
                    });
                  });
                });
              });
            });
          });
        });

      });

      $scope.showServiceTaxDetails = false;
    };
    $scope.todaysDate = function(callback) {
      // var date = new Date();
      // var day = date.getDate();
      // var month = date.getMonth() + 1;
      // var year = date.getFullYear();
      // if (month<10) month = '0' + month;
      // if (day<10) day = '0' + day;
      // var today = year + '-' + month + '-' + day;
      // return today;
      $scope.dates = {
        startDate: new Date(),
        endDate: new Date(),
        maxdate: new Date()
      };
      // $scope.startDate= today;
      // $scope.endDate= today;
      // $scope.maxdate=today;
      if (callback) callback();
    };

    $scope.getRevenueDateWise = function() {
      $scope.getRevenueDetailsFromBillRentalArchives(function() {
        $scope.getMembershipRevenueDateWise(function() {
          $scope.getBillRevenueDateWise(function() {
            $scope.convertMembershipRevenueInToFixed(function() {
              $scope.convertRevenueDetailsFromBillRentalArchivesInToFixed(function() {
                $scope.convertTotalRevenueInToFixed(function() {
                  $scope.getTotalRevenueForPaymentTypeDateWise(function() {
                    $scope.convertTotalRevenueForPaymentTypeInToFixed(function() {

                      if ($scope.revenueDetailsFromBillRentalArchives.deposit === null) {
                        $scope.revenueDetailsFromBillRentalArchives.deposit = 0;
                      }

                      $scope.revenueDetailsFromBillRentalArchives.deposit = $scope.revenueDetailsFromBillRentalArchives.deposit.toLocaleString('en-IN', { minimumFractionDigits: 2 });

                      $scope.totalRevenue.billTotal = parseFloat($scope.totalRevenue.billTotal.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.deposit.replace(/, /g, '')).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      console.log(parseFloat(Number($scope.totalRevenue.billTotal)));

                      $scope.totalpaymentType = parseFloat(Number($scope.totalpaymentType.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.deposit.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                    });
                  });
                });
              });
            });
          });
        });
      });

    };

    $scope.getBillRevenueDateWise = function(callback) {
      // $scope.dates.startDate.setHours(0,0,0,0);
      // console.log($scope.dates.startDate);
     /* $http.get('/totalRevenueOfDays', {
        params: { startDate: $scope.dates.startDate, endDate: $scope.dates.endDate }
      }).success(function(data, status) {
        $scope.totalRevenue = data;
        if (callback) callback();
      });*/
      $http.get('/totalRevenueOfDays', { params: { startDate: $scope.dates.startDate, endDate: $scope.dates.endDate }
      }).then(function(data, status) {
        console.log(data);
        $scope.totalRevenue = data.data;
        if (callback) callback();
      });
    };

    $scope.getTotalRevenueForPaymentTypeDateWise = function(callback) {
      $http.get('/totalRevenueForPaymentTypeOfDays', {
        params: { startDate: $scope.dates.startDate, endDate: $scope.dates.endDate }
      }).then(function(data, status) {
        console.log(data);
        $scope.totalRevenueForPaymentType = data.data;
        if (callback) callback();
      });
    };

    $scope.getMembershipRevenueDateWise = function(callback) {
      $http.get('/totalMembershipRevenueOfDays', {
        params: { startDate: $scope.dates.startDate, endDate: $scope.dates.endDate }
      }).then(function(data, status) {
        console.log(data.data);
        $scope.totalMembershipRevenue = data.data;
        // console.log($scope.totalMembershipRevenue.serviceTaxOnMembership);
        // console.log($scope.totalMembershipRevenue.serviceTaxOnMembership.toLocaleString());
        if (callback) callback();
      });
    };

    $scope.getRevenueDetailsFromBillRentalArchives = function(callback) {
      $http.get('/totalRevenueDetailsFromBillRentalArchivesForDays', {
        params: { startDate: $scope.dates.startDate, endDate: $scope.dates.endDate }
      }).then(function(data, status) {
        console.log(data);
        $scope.revenueDetailsFromBillRentalArchives = data.data;
        if (callback) callback();
      });
    };

    /* function to convert the values into two decimal points
    *
    */
    $scope.convertRevenueDetailsFromBillRentalArchivesInToFixed = function(callback) {

      $scope.revenueDetailsFromBillRentalArchives.gameRevenue = $scope.revenueDetailsFromBillRentalArchives.gameRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.foodRevenue = $scope.revenueDetailsFromBillRentalArchives.foodRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.packageRevenue = $scope.revenueDetailsFromBillRentalArchives.packageRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.serviceTaxOnFood = $scope.revenueDetailsFromBillRentalArchives.serviceTaxOnFood.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.serviceTaxOnGame = $scope.revenueDetailsFromBillRentalArchives.serviceTaxOnGame.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.serviceTaxForPackage = $scope.revenueDetailsFromBillRentalArchives.serviceTaxForPackage.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.serviceChargeOnFood = $scope.revenueDetailsFromBillRentalArchives.serviceChargeOnFood.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.serviceChargeOnGame = $scope.revenueDetailsFromBillRentalArchives.serviceChargeOnGame.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.serviceChargeForPackage = $scope.revenueDetailsFromBillRentalArchives.serviceChargeForPackage.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.vatOnFood = $scope.revenueDetailsFromBillRentalArchives.vatOnFood.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.vatForPackage = $scope.revenueDetailsFromBillRentalArchives.vatForPackage.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.revenueDetailsFromBillRentalArchives.membershipDiscountOnFood = ($scope.revenueDetailsFromBillRentalArchives.membershipDiscountOnFood) ? $scope.revenueDetailsFromBillRentalArchives.membershipDiscountOnFood.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00';

      /* $scope.totalOnServiceTax1 = $scope.revenueDetailsFromBillRentalArchives.serviceTaxOnFood;
      $scope.totalOnServiceTax2 = $scope.revenueDetailsFromBillRentalArchives.serviceTaxOnGame;
      $scope.totalOnServiceTax3 =parseFloat(Number($scope.revenueDetailsFromBillRentalArchives.serviceTaxOnFood.replace(/,/g,'')) + Number($scope.revenueDetailsFromBillRentalArchives.serviceTaxOnGame.replace(/,/g,''))).toFixed(2); */

      $scope.totalOnServiceTax = parseFloat(Number($scope.revenueDetailsFromBillRentalArchives.serviceTaxOnFood.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.serviceTaxOnGame.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.serviceTaxForPackage.replace(/, /g, '')) + Number($scope.totalMembershipRevenue.serviceTaxOnMembership.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.totalOnServiceCharge = parseFloat(Number($scope.revenueDetailsFromBillRentalArchives.serviceChargeOnFood.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.serviceChargeOnGame.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.serviceChargeForPackage.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.totalOnVat = parseFloat(Number($scope.revenueDetailsFromBillRentalArchives.vatOnFood.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.vatForPackage.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

      if (callback) callback();
    };

    $scope.convertMembershipRevenueInToFixed = function(callback) {
      $scope.totalMembershipRevenue.serviceTaxOnMembership = $scope.totalMembershipRevenue.serviceTaxOnMembership.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      $scope.totalMembershipRevenue.billPrice = $scope.totalMembershipRevenue.billPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      if (callback) callback();
    };

    $scope.convertTotalRevenueInToFixed = function(callback) {
      $scope.totalRevenue.billTotal = $scope.totalRevenue.billTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      $scope.totalRevenue.discountInValue = $scope.totalRevenue.discountInValue.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      $scope.totalRevenue.extraCharge = $scope.totalRevenue.extraCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      $scope.totalRevenue.rounding = $scope.totalRevenue.rounding.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.totalOnDiscount = parseFloat(Number($scope.totalRevenue.discountInValue.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.membershipDiscountOnFood.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

      $scope.foodRevenueWithDiscount = parseFloat(Number($scope.revenueDetailsFromBillRentalArchives.foodRevenue.replace(/, /g, '')) + Number($scope.revenueDetailsFromBillRentalArchives.membershipDiscountOnFood.replace(/, /g, ''))).toLocaleString('en-IN', { minimumFractionDigits: 2 });

      // $scope.totalRevenue.billTotal=parseFloat(Number($scope.totalRevenue.billTotal)+Number($scope.revenueDetailsFromBillRentalArchives.deposit)).toFixed(2);

      if (callback) callback();
    };

    $scope.convertTotalRevenueForPaymentTypeInToFixed = function(callback) {
      // + Number($scope.totalMembershipRevenue.serviceTaxOnMembership) + Number($scope.totalMembershipRevenue.billPrice)
      $scope.totalpaymentType = 0;
      for (var p = 0; p < $scope.totalRevenueForPaymentType.length; p++) {
        $scope.totalRevenueForPaymentType[p].value = parseFloat(Number($scope.totalRevenueForPaymentType[p].value)).toFixed(2);
        $scope.totalpaymentType = parseFloat(Number($scope.totalpaymentType) + Number($scope.totalRevenueForPaymentType[p].value)).toFixed(2);
      }
      if (callback) callback();
    };
/* ************************************** function to Expand and collapse table with table *********************************** */
    $scope.serviceTaxClicked = function() {
      $scope.showServiceTaxDetails = !$scope.showServiceTaxDetails;
    };

    $scope.vatExpandClicked = function() {
      $scope.showVatDetails = !$scope.showVatDetails;
    };

    $scope.serviceChargeClicked = function() {
      $scope.showServiceChargeDetails = !$scope.showServiceChargeDetails;
    };

    $scope.discountSectionClicked = function() {
      $scope.showDiscountSectionDetails = !$scope.showDiscountSectionDetails;
    };
  }
}());
