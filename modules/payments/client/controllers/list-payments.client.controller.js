(function () {
  'use strict';

  angular
    .module('stockaudits')
    .controller('StockauditsListController', StockauditsListController);

  StockauditsListController.$inject = ['StockauditsService'];

  function StockauditsListController(StockauditsService) {
    var vm = this;

    vm.stockaudits = StockauditsService.query();
  }
}());
