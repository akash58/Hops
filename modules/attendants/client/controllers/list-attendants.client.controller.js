(function () {
  'use strict';

  angular
    .module('attendants')
    .controller('AttendantsListController', AttendantsListController);

  AttendantsListController.$inject = ['AttendantsService'];

  function AttendantsListController(AttendantsService) {
    var vm = this;

    vm.attendants = AttendantsService.query();
  }
}());
