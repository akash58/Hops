(function () {
  'use strict';

  // Attendants controller
  angular
    .module('attendants')
    .controller('AttendantsController', AttendantsController);

  AttendantsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdToast', '$http', 'attendantResolve', 'filterFilter', 'AttendantsService', 'Notification', '$log', '$q', 'UsersService', '$stateParams', '$location'];

  function AttendantsController ($scope, $state, $window, Authentication, $mdToast, $http, attendant, AttendantsService, filterFilter, Notification, $log, $q, UsersService, $stateParams, $location) {
    var vm = this;

    vm.authentication = Authentication;
    vm.attendant = attendant;
    vm.AttendantsService = AttendantsService;
    vm.error = null;
    vm.showProgress = false;
    vm.form = {};
    vm.tempData = $http.get('/api/findByToken', { params: { token: $stateParams.token } }).then(function successCallback(response) {
      vm.tempData = response;
    }, function errorCallback(errorResponse) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
    vm.emailAttendant = {
      email: ''
    };

    vm.attendant = {
      firstName: '',
      lastName: ''
    };

    /* $scope.removeTenant = function(tenant) {
      var index = $scope.tempTenants.indexOf(tenant);
      $scope.tempTenants.splice(index, 1);
    };
    $scope.removeRole = function(role) {
      var index = $scope.tempRoles.indexOf(role);
      $scope.tempRoles.splice(index, 1);
    };
*/
    // Save Attendants
    vm.attendantEmail = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.attendantForm');

        return false;
      }
      vm.showProgress = true;
      var attendant = {
        email: vm.email
      };
      $http.post('/api/attendants', attendant).then(function (success) {
        vm.email = '';
        // vm.attendantForm.$setPristine();
        // vm.attendantForm.$setUntouched();
        // vm.attendantForm.email.$touched = false;
        // vm.attendantForm.email.$valid = false;
        Notification.success('Attendant is created');
        vm.showProgress = false;
      }, function(errorResponse) {
        vm.showProgress = false;
        Notification.error(errorResponse);
      });
    };

    vm.createAttendant = function(valid) {
      if (!valid) {
        return Notification.error('Please Fill Full Form');
      }
      vm.showProgress = true;
      var attendantCreate = {
        username: vm.username,
        firstName: vm.firstName,
        lastName: vm.lastName,
        password: vm.password,
        email: vm.tempData.data.email,
        tenants: vm.tempData.data.tenants,
        tenantGroup: vm.tempData.data.tenantGroup
      };
      $http.post('/api/attendants/createAttendantUser', attendantCreate).then(function(success) {
        Notification.success('Attendant ' + vm.username + ' is created');
        vm.form.attendantForm.$setPristine();
        vm.form.attendantForm.$setUntouched();
        vm.username = '';
        vm.firstName = '';
        vm.lastName = '';
        vm.password = '';
        vm.tempData.data.email = '';
        $scope.response = success;
        vm.showProgress = false;
        $location.path('/');
      }, function(errorResponse) {
        Notification.error(errorResponse);
      });
    };
    /* $scope.addTenants = function(attendants, callback) {
     // $scope.test='attendants';
     // console.log($scope.tempTenants);
     // console.log(attendants)
      if ($scope.attend.tenants !== '')
        if ($scope.tempTenants.indexOf(attendants) < 0) {
          $scope.tempTenants.push(attendants);
          $scope.attend.tenants = '';
        } else {
          // $scope.duplicatedError = true;
        }
      if (callback) callback();
    }; */
    /* $scope.addRoles = function(attendants, callback) {
     // $scope.test='attendants';
     // console.log($scope.tempRoles);
     // console.log(attendants)
      if ($scope.attend.roles !== '')
        if ($scope.tempRoles.indexOf(attendants) < 0) {
          $scope.tempRoles.push(attendants);
          $scope.attend.roles = '';
        } else {
          // $scope.duplicatedError = true;
        }
      if (callback) callback();
    };*/

    // Remove existing Attendant
   /* function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.attendant.$remove($state.go('attendants.list'));
      }
    }

    // Save Attendant
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.attendantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.attendant._id) {
        vm.attendant.$update(successCallback, errorCallback);
      } else {
        vm.attendant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('attendants.view', {
          attendantId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }*/
  }
}());
