(function () {
  'use strict';

  angular
    .module('foodorderreport')
    .controller('FoodorderreportListController', FoodorderreportListController);

  FoodorderreportListController.$inject = ['foodorderreportsService'];

  function FoodorderreportListController(foodorderreportsService) {
    var vm = this;

    // vm.foodorderreports = foodorderreportsService.query();
  }
}());
