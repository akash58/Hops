(function () {
  'use strict';

  // paymentmodetypes controller
  angular
    .module('paymentmodetypes')
    .controller('PaymentModeTypesController', PaymentModeTypesController);

  PaymentModeTypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'paymentmodetypeResolve', 'PaymentmodetypesService', 'Notification'];

  function PaymentModeTypesController ($scope, $state, $window, Authentication, paymentmodetypeResolve, PaymentmodetypesService, Notification) {
    var vm = this;

    vm.authentication = Authentication;

    $scope.find = function() {
      $scope.paymentmodetypes = PaymentmodetypesService.query();
      $scope.addPaymentModeTypeclicked = false;
      $scope.errorPaymentModeTypes = false;
      $scope.savedPaymentModeTypeSuccessfully = false;
      $scope.pt = { paymentType: '' };
    };

    $scope.createPaymentModeType = function() {

      var paymentmodetype = new PaymentmodetypesService({
        paymentType: $scope.pt.paymentType
      });

      paymentmodetype.$save(function(response) {
        $scope.paymentmodetypeForm.$setPristine();
        $scope.paymentmodetypeForm.paymentMode.$touched = false;
        $scope.paymentmodetypeForm.paymentMode.$valid = false;
        $scope.savedPaymentModeTypeSuccessfully = true;
        $scope.errorPaymentModeType = '';
        $scope.pt.paymentType = '';
        $scope.paymentmodetypes = PaymentmodetypesService.query();
      }, function(errorResponse) {
        $scope.errorPaymentModeType = errorResponse.data.message;
        $scope.savedPaymentModeTypeSuccessfully = '';
      });
    };

    $scope.editButtonClicked = function(paymentmodetype) {
      paymentmodetype.editButtonClicked = true;
    };

    $scope.focusPaymentType = function() {
      $scope.errorPaymentModeType = false;
      $scope.savedPaymentModeTypeSuccessfully = false;
    };

    $scope.addPaymentModeTypebuttonclicked = function() {
      $scope.addPaymentModeTypeclicked = !$scope.addPaymentModeTypeclicked;
      $scope.focusPaymentType();
      $scope.pt.paymentType = '';
    };

    $scope.clickPaymentModeType = function(paymentmodetype) {
      if ($scope.activePaymentModeType === paymentmodetype._id)
        $scope.activePaymentModeType = '';
      else {
        $scope.activePaymentModeType = paymentmodetype._id;
        $scope.activePaymentType = paymentmodetype.paymentType;
      }
      $scope.focusPaymentType();
    };

    $scope.deactivatePaymentModeType = function(paymentmodetype) {
      if (paymentmodetype.paymentType === 'Cash')
        paymentmodetype.errorpaymentModeTypeUpdate = 'Cannot delete Cash!';
      else {
        if ($window.confirm('are you want to delete ' + paymentmodetype.paymentType + ' ?')) {
          paymentmodetype.user = paymentmodetype.user._id || paymentmodetype.user;
          paymentmodetype.active = false;

          paymentmodetype.$update(function() {
          }, function(errorResponse) {
            paymentmodetype.active = true;
            paymentmodetype.errorpaymentModeTypeUpdate = errorResponse.data.message;
          });
        }
      }
    };
  }
}());
