(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('CreateCompanyController', CreateCompanyController);

  CreateCompanyController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', '$http'];

  function CreateCompanyController($scope, $state, $window, Authentication, Notification, $http) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.user = user;
    vm.saveCompany = function() {
      $http.post('/api/user/createCompany', { companyName: vm.companyName })
        .then(function(response) {
          vm.authentication.user = response.data;
          // console.log(response);
          vm.companyName = '';
          $scope.success = 'company create successfully';
        }, function(err) {
          $scope.error = err;
        });
    };

  }
}());
