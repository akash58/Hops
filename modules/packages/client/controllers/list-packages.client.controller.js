(function () {
  'use strict';

  angular
    .module('packages')
    .controller('PackagesListController', PackagesListController);

  PackagesListController.$inject = ['PackagesService'];

  function PackagesListController(PackagesService) {
    var vm = this;

    vm.packages = PackagesService.query();
  }
}());
