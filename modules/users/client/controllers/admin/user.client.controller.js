(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'RolesService', '$q'];

  function UserController($scope, $state, $window, Authentication, user, Notification, RolesService, $q) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.roles = [];
    for (var i = 0; i < vm.user.roles.length; i++) {
      vm.roles[i] = { roleName: vm.user.roles[i] };
    }
    vm.isContextUserSelf = isContextUserSelf;

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    vm.queryRoles = function(query) {
      var deferred = $q.defer();
      RolesService.query({ roleName: query }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    vm.transformChip = function(chip) {
      if (angular.isObject(chip) || chip.roleName) {
        return { roleName: chip.roleName };
      }
    };

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      vm.user.roles = [];
      for (var i = 0; i < vm.roles.length; i++) {
        vm.user.roles[i] = vm.roles[i].roleName;
      }
      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User Updated Successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
