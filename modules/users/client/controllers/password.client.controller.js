(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Notification', '$http', '$state'];

  function PasswordController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Notification, $http, $state) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.showProgress = false;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

       // Create admin password
    $scope.createAdminPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.newPasswordForm');
        return false;
      }

      vm.showProgress = true;

      $http.post('/api/auth/new/' + $stateParams.token, vm.passwordDetails).then(onCreateNewUserForFirstTime, onCreateNewUserForFirstTimeError);

      // $http({
      //   method: 'POST',
      //   url: '/api/auth/new/' + $stateParams.token, vm.passwordDetails
      // }).then(function successCallback(response) {

      //   vm.passwordDetails = null;
      //   // Attach user profile
      //   Authentication.user = response;
      //   $state.go('password.new.success');
      //   // console.log($scope.incrementparameters);
      //   if (callback) callback();
      // }, function errorCallback(response) {

      //   $scope.error = response.message;
      //   if (callback) callback();
      // });

      // $http.post('/api/auth/new/' + $stateParams.token, vm.passwordDetails).success(function (response) {

      //   vm.passwordDetails = null;
      //   // Attach user profile
      //   Authentication.user = response;

      //   $state.go('password.new.success');


      // }).error(function (response) {
      //   $scope.error = response.message;
      // });
    };

    function onCreateNewUserForFirstTime(response) {
      vm.passwordDetails = null;
      // Attach user profile
      console.log(response);
      Authentication.user = response.data;
      $location.path('/');
      // $state.go('password.new.success1');
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Create successful!' });
    }

    function onCreateNewUserForFirstTimeError(response) {
      $scope.error = response.message;
    }


    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      Notification.success({ message: response.message, title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!' });
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to send password reset email!', delay: 4000 });
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password reset successful!' });
      // And redirect to the index page
      $location.path('/password/reset/success');
    }

    function onResetPasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password reset failed!', delay: 4000 });
    }
  }
}());
