(function () {
  'use strict';

  angular
    .module('systemparameters')
    .controller('SystemparametersListController', SystemparametersListController);

  SystemparametersListController.$inject = ['SystemparametersService'];

  function SystemparametersListController(SystemparametersService) {
    var vm = this;

    vm.systemparameters = SystemparametersService.query();
  }
}());
