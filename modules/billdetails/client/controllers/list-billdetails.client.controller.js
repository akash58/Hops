(function () {
  'use strict';

  angular
    .module('billdetails')
    .controller('BilldetailsListController', BilldetailsListController);

  BilldetailsListController.$inject = ['BilldetailsService'];

  function BilldetailsListController(BilldetailsService) {
    var vm = this;
    vm.billdetails = BilldetailsService.query();
  }
}());
