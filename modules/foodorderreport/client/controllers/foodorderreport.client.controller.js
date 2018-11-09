(function () {
  'use strict';

  angular
    .module('foodorderreport')
    .controller('FoodorderreportController', FoodorderreportController);

  FoodorderreportController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'SystemparametersService', 'foodorderreportsService', 'filterFilter'];

  function FoodorderreportController ($scope, $state, $window, Authentication, Notification, SystemparametersService, foodorderreportsService, filterFilter) {
    var vm = this;

    vm.authentication = Authentication;

    $scope.initialize = function() {
      $scope.type = { value: 'detailRevenue' };
      $scope.systemparameters = SystemparametersService.query(function() {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
      });

      $scope.todaysDate(function() {
        $scope.dateChange = false;
        $scope.setDefaultStartDate(function() {
          $scope.setDefaultEndDate(function() {
            $scope.getFoodOrderReport(function() {
              $scope.legends = { legendValue: true };
              var weekday = [];
              weekday[0] = 'Sunday';
              weekday[1] = 'Monday';
              weekday[2] = 'Tuesday';
              weekday[3] = 'Wednesday';
              weekday[4] = 'Thursday';
              weekday[5] = 'Friday';
              weekday[6] = 'Saturday';
              $scope.labels = weekday;
              // console.log($scope.labels);
              $scope.chartsValue();
            });
          });
        });
      });
    };
    $scope.getFood = function(foodorderReport) {
      /* console.log(foodorderReport);
      console.log($scope.activeFoodOrderType);*/
      if ($scope.activeFoodOrderType === foodorderReport._id) {
        $scope.activeFoodOrderType = '';
      } else {
        $scope.activeFoodOrderType = foodorderReport._id;
        $scope.foods = [];
        for (var i = 0; i < $scope.foodorderReports.food.length; i++) {
          if ($scope.foodorderReports.food[i]._id.foodtype._id === foodorderReport._id) {
            $scope.foods.push($scope.foodorderReports.food[i]);
          }
        }
      }
    };
    $scope.todaysDate = function(callback) {
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      var today = year + '-' + month + '-' + day;
      $scope.dates = { todaysDate: today, maxdate: today, startDate: '', endDate: '' };
      if (callback) callback();
    };
    $scope.setDefaultStartDate = function(callback) {
      var day = $scope.dates.todaysDate.substring(8, 10);
      // console.log(day);
      var month = $scope.dates.todaysDate.substring(5, 7) - 1;
      // console.log(month);
      var year = $scope.dates.todaysDate.substring(0, 4);
      // console.log(year);

      var date = new Date(year, month, day);
      /* var date1 = new Date()
      console.log(date1);
      console.log(date);*/
      date.setDate(date.getDate() - 28);
      /* console.log(date.getDate() - 28);
      console.log(date.getDate());
      console.log(date.setDate(date.getDate() - 28));*/

      day = date.getDate();
      // console.log(day);
      month = date.getMonth() + 1;
      // console.log(month);
      year = date.getFullYear();
      // console.log(year);

      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;

      var startDateToBeSet = year + '-' + month + '-' + day;
      // console.log(startDateToBeSet);

      $scope.dates.startDate = new Date(startDateToBeSet);

      if (callback) callback();
    };
    $scope.setDefaultEndDate = function(callback) {


      var day = $scope.dates.todaysDate.substring(8, 10);
      // console.log(day);
      var month = $scope.dates.todaysDate.substring(5, 7) - 1;
      // console.log(month)
      var year = $scope.dates.todaysDate.substring(0, 4);
      // console.log(year);

      var date = new Date(year, month, day);
      // console.log(date);
      var date1 = new Date(date.setDate(date.getDate() - 1));
      /* console.log(date.getDate() - 1);
      console.log(new  Date(date.setDate(date.getDate() - 1)));
*/
      day = date.getDate();
      // console.log(day);
      month = date.getMonth() + 1;
      // console.log(month);
      year = date.getFullYear();
      // console.log(year);

      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;

      var endDateToBeSet = year + '-' + month + '-' + day;
      // console.log(endDateToBeSet);

      $scope.dates.endDate = new Date(endDateToBeSet);
      // console.log($scope.dates.endDate);
      // console.log(typeof($scope.dates.endDate));
      if (callback) callback();
    };

    $scope.dateChangeClick = function() {
      $scope.dateChange = true;
    };

    $scope.clickedOnSearchButton = function() {
      $scope.dateChange = false;
      $scope.getFoodOrderReport(function() {
        $scope.chartsValue();
      });
    };

    $scope.getFoodOrderReport = function() {
      // console.log('hii');
      foodorderreportsService.get({ startDate: $scope.dates.startDate, endDate: $scope.dates.endDate }, function(data) {
        // console.log(data);
        $scope.foodorderReports = data;
      });
    };
  }
}());
