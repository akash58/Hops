(function () {
  'use strict';

  // Feedbacks controller
  angular
    .module('feedbacks')
    .controller('FeedbacksController', FeedbacksController);

  FeedbacksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'FeedbacksService', '$mdDialog'];

  function FeedbacksController ($scope, $state, $window, Authentication, Feedbacks, $mdDialog) {
    var vm = this;
    vm.authentication = Authentication;
    // vm.feedback = feedback;
    // vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    // vm.save = save;
    // $scope.Feedbacks = FeedbacksService.query();
    $scope.createFeeedbackRecord = function(ev) {
      var feedbacks = new Feedbacks({
        knowabout: $scope.knownselection.radioValue,
        games: $scope.rateus.radio,
        food: $scope.ratefood,
        contents: $scope.content,
        DateOfCreation: $scope.dateOfCreation
      });
      feedbacks.$save(function(response) {
        $scope.savedFeedbackSuccessfully = true;
        $scope.knownselection.radioValue = 'Internet';
        $scope.rateus.radio = 'excellent';
        $scope.ratefood = 'excellent';
        $scope.content = '';
        // alert(' Thank you for the feedback ');
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Thank you for the feedback!')
            .textContent('Your feedback is highly appeciated and used by us to improve ourself.')
            .ariaLabel('Thank You for feedback dialog!')
            .ok('OK')
            .targetEvent(ev)
        );
      }, function(errorResponse) {
        $scope.errorCustomer = errorResponse.data.message;
        $scope.savedFeedbackSuccessfully = '';
      });
    };
    $scope.todaysDate = function() {
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      var today = year + '-' + month + '-' + day;
      return today;
    };
    $scope.find = function() {
      // $scope.test='testing';
      // $scope.customers=new Customers.query();
      $scope.inputfocus = false;
      $scope.knownselection = { radioValue: 'Internet' };
      $scope.rateus = { radio: 'excellent' };
      $scope.ratefood = 'excellent';
      $scope.content = '';
      $scope.dateOfCreation = $scope.todaysDate();
      // $scope.feedbacks=Feedbacks.query();
    };
    $scope.enableSignUpButton = function() {
      if ($scope.termsAgreed === true) {
        $scope.disableSignUpButton = false;
      } else if ($scope.termsAgreed === false) {
        $scope.disableSignUpButton = true;
      }
    };
    $scope.findOne = function() {
    };
    /* $scope.focusCustomer = function() {
      $scope.errorCustomer = false;
      $scope.savedCustomerSuccessfully = false;
    }; */
    $scope.checkNumberOnly = function(e) {
      var a = [];
      var k = e.which;
      for (var i = 48; i < 58; i++)
        a.push(i);
      if (a.indexOf(k) < 0)
        e.preventDefault();
    };
    $scope.tocheckMobileDigit = function() {
      if ($scope.custSignUp.mobile.length <= 7) {
        $scope.inputfocus = true;
      } else {
        $scope.inputfocus = false;
      }
    };
    // Remove existing Feedback
    /* function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.feedback.$remove($state.go('feedbacks.list'));
      }
    }
    // Save Feedback
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.feedbackForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.feedback._id) {
        vm.feedback.$update(successCallback, errorCallback);
      } else {
        vm.feedback.$save(successCallback, errorCallback);
      }
      function successCallback(res) {
        $state.go('feedbacks.view', {
          feedbackId: res._id
        });
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }*/
  }
}());
