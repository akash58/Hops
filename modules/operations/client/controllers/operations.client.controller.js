(function () {
  'use strict';

  angular
    .module('operations')
    .controller('OperationsController', OperationsController);

  OperationsController.$inject = ['$scope', '$http', 'Authentication', 'TablesService', 'SystemparametersService', 'filterFilter', '$location', '$state'];

  function OperationsController($scope, $http, Authentication, Tables, SystemParameters, filterFilter, $location, $state) {
    var vm = this;

    vm.authentication = Authentication;

    $scope.find = function() {
      // pageAuthentication.shouldRender('Operations Overview').then(function(res) {
      //     $scope.operationsPageVisible = res;
      // });
      /*  $scope.pages=Pages.query(function(){
        $scope.operationsPageVisible = $scope.shouldRender();
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
      $scope.systemparameters = SystemParameters.query(function() {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
      });

      $scope.tables = Tables.query(function () {
        $scope.getRentalSummary(function() {
          $scope.appendTableSerials();
        });
      });

      // $scope.getUnpaidBillSummary();
    };

    $scope.getUnpaidBillSummary = function(callback) {
      // $http.get('/getUnpaidBillForOperations').success(function(data,status) {
      //   $scope.unpaidBillsummary = data;
      //   if (callback) callback();
      // });
      $http.get('/api/getUnpaidBillForOperations').then(function(response) {
      /* var data = response.data;
        var status = response.status; */
        $scope.unpaidBillsummary = response.data;
      }, function(err) {
        if (callback) callback();
      });
    };

    $scope.getRentalSummary = function(callback) {
      // $http.get('/api/rentalsummary').success(function(data,status){
      //   $scope.rentalsummary = data;
      //   if (callback) callback();
      // });
      $http.get('/api/rentalsummary').then(function(response) {
        var data = response.data;
        var status = response.status;
        $scope.rentalsummary = data;
        if (callback) callback();
      }, function(err) {
        if (callback) callback();
      });
    };

    $scope.tableClicked = function(table) {
      // ActiveTable.set(table._id);
      // $location.path('/tabledetails');
      $state.go('rentals.details', { tableId: table._id });
    };

    $scope.appendTableSerials = function() {
      for (var i = 0; i < $scope.tables.length; i++) {
        if ($scope.tables[i].serial) {
          $scope.tables[i].displaySerial = $scope.tables[i].serial.serialNumber + ' - ' + $scope.tables[i].serial.product.productNumber;
          $scope.tables[i].busyCount = 0;
          $scope.tables[i].maxRentalEndTime = '00:00';
          $scope.tables[i].remainingTime = 'N/A';

          $scope.tables[i].totalRevenue = 0;
          // $scope.test = 'test' + $scope.rentalsummary.length;
          for (var j = 0; j < $scope.rentalsummary.length; j++) {
            if ($scope.tables[i]._id === $scope.rentalsummary[j]._id) {
              $scope.tables[i].busyCount = $scope.rentalsummary[j].busyCount;
              $scope.tables[i].maxRentalEndTime = $scope.rentalsummary[j].maxRentalEndTime;
              // var d = new Date();
              var diffInMillisec = (new Date($scope.rentalsummary[j].maxRentalEndTime)).getTime() - Date.now();
              var diffInHour = diffInMillisec < 0 ? Math.floor((- diffInMillisec + 30000) / 3600000) : Math.floor((diffInMillisec + 30000) / 3600000);
              var diffInMin = diffInMillisec < 0 ? Math.round((- diffInMillisec - diffInHour * 3600000) / 60000) : Math.round((diffInMillisec - diffInHour * 3600000) / 60000);
              // $scope.tables[i].remainingTime = diffInMillisec < 0 ? ('-' + (diffInHour < 10 ? '0' : '')) + diffInHour + ':' + (diffInMin < 10 ? '0' : '') + diffInMin) : ((diffInHour < 0 ? '' : (diffInHour < 10 ? '0' : '')) + diffInHour + ':' + (diffInMin < 10 ? '0' : '') + diffInMin);
              var tempMillisec = '',
                tempHour = '',
                tempMin = '';
              if (diffInMillisec < 0) {
                tempMillisec = '-';
              } else {
                tempMillisec = '';
              }

              if (diffInHour < 0) {
                tempHour = '';
              } else if (diffInHour < 10) {
                tempHour = '0';
              } else {
                tempHour = '';
              }

              if (diffInMin < 10) {
                tempMin = '0';
              } else {
                tempMin = '';
              }
              $scope.tables[i].remainingTime = tempMillisec + tempHour + diffInHour + ':' + tempMin + diffInMin;
              // $scope.tables[i].remainingTime = (diffInMillisec < 0 ? '-' : '') + ((diffInHour < 0 ? '' : (diffInHour < 10 ? '0' : '')) + diffInHour + ':' + (diffInMin < 10 ? '0' : '') + diffInMin);
              $scope.tables[i].totalRevenue = $scope.rentalsummary[j].totalRevenue;

              break;

            }
          }
        } else {
          // console.log('called');
          $scope.tables[i].totalRevenue = 0;
          for (var b = 0; b < $scope.rentalsummary.length; b++) {
            if ($scope.tables[i]._id === $scope.rentalsummary[b]._id) {
              $scope.tables[i].busyCount = $scope.rentalsummary[b].busyCount;
              $scope.tables[i].totalRevenue = $scope.rentalsummary[b].totalRevenue;

              break;

            }
          }
        }
        /* for(var t=0;t<$scope.unpaidBillsummary.length;t++){
          if($scope.tables[i]._id ===$scope.unpaidBillsummary[t]._id){
            $scope.tables[i].unpaidBills=$scope.unpaidBillsummary[t].value.billUnpaidCount;
            $scope.tables[i].unpaidAmount=$scope.unpaidBillsummary[t].value.billAmount;
            break;
          }
        } */

      }
      // $scope.exceedeTime();
    };

    /* $scope.exceedeTime = function(){
      for(var i = 0; i < $scope.tables.length; i++){
        $scope.tables[i].maxRentalEndTime = '00:00';
        $scope.tables[i].exceededTime = 'N/A';

        for (var j = 0; j < $scope.rentalsummary.length; j++) {
          if ($scope.tables[i]._id === $scope.rentalsummary[j]._id){
            $scope.tables[i].maxRentalEndTime = $scope.rentalsummary[j].maxRentalEndTime;

            var exceededDiffInMillisec = Date.now()-(new Date($scope.rentalsummary[j].maxRentalEndTime)).getTime();
            var exceededDiffInHour = Math.floor((exceededDiffInMillisec+30000)/3600000);
            var exceededDiffInMin = Math.round((exceededDiffInMillisec - exceededDiffInHour * 3600000) /60000);
            $scope.tables[i].exceededTime = (exceededDiffInHour < 0 ? '' : (exceededDiffInHour < 10 ? '0' : '')) + exceededDiffInHour + ':' + (exceededDiffInMin < 10 ? '0' : '') + exceededDiffInMin;

            break;
          }
        }
      }
    }; */


/* ***********************************************clear & unavailable Table****************************************** */

    $scope.uptadeTable = function(table) {
      var sendTableUpdate = new Tables({
        _id: table._id,
        status: 'available',
        currentAttendant: null,
        serial: null
      });

      sendTableUpdate.$update(function() {
        $scope.find();
      });
    };

    $scope.uptadeTableUnavailable = function(table) {
      var sendTabUpdate = new Tables({
        _id: table._id,
        status: 'unavailable',
        currentAttendant: null,
        serial: null
      });

      sendTabUpdate.$update(function() {
        $scope.find();
      });
    };


    $scope.blinkTime = function() {
      for (var i = 0; i < $scope.tables.length; i++) {
        $scope.tables[i].maxRentalEndTime = '00:00';
        // $scope.tables[i].reminderTime = '00:05';

        for (var j = 0; j < $scope.rentalsummary.length; j++) {
          if ($scope.tables[i]._id === $scope.rentalsummary[j]._id) {
            $scope.tables[i].maxRentalEndTime = $scope.rentalsummary[j].maxRentalEndTime;
            var diffInMillisecRe = (new Date($scope.rentalsummary[j].maxRentalEndTime)).getTime() - Date.now();
            var diffInHourRe = Math.floor((diffInMillisecRe + 30000) / 3600000);
            var diffInMinRe = Math.round((diffInMillisecRe - diffInHourRe * 3600000) / 60000);
            $scope.test = 'work';
            $scope.test1 = $scope.tables[i].maxRentalEndTime;
            // var fiveMin = Math.floor((60 * 5));


            // $scope.tables[i].reminderTime = Date.setMinutes('00:05');
            /* if($scope.tables[i].remainingTime <= $scope.tables[i].reminderTime){

              document.getElementById('blink').style.WebkitAnimation = 'time';
            } */
          }
        }
      }
    };
  }
}());
