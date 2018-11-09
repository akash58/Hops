(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    // console.log($window.user);
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());
