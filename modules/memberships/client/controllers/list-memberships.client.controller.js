(function () {
  'use strict';

  angular
    .module('memberships')
    .controller('MembershipsListController', MembershipsListController);

  MembershipsListController.$inject = ['MembershipsService'];

  function MembershipsListController(MembershipsService) {
    var vm = this;

    vm.memberships = MembershipsService.query();
  }
}());
