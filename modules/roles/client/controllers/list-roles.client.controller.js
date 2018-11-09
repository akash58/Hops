(function () {
  'use strict';

  angular
    .module('roles')
    .controller('RolesListController', RolesListController);

  RolesListController.$inject = ['$scope', '$stateParams', '$location', 'RolesService', 'Authentication'];

  function RolesListController($scope, $stateParams, $location, RolesService, pageAuthentication) {
   // var vm = this;

    $scope.roles = RolesService.query();

    $scope.createRole = function() {
      var role = new RolesService({
        roleName: $scope.rol.roleName
      });

      role.$save(function() {
        $scope.savedSuccessfully = true;
        $scope.error = '';
        $scope.clearRole();
        $scope.roles = RolesService.query();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
        $scope.savedSuccessfully = '';
      });
    };
    $scope.remove = function(role) {
      if (role) {
        role.$remove();
        for (var i in $scope.roles) {
          if ($scope.roles[i] === role) {
            $scope.roles.splice(i, 1);
          }
        }
      } else {
        $scope.role.$remove(function() {
          $location.path('roles');
        });
      }
    };
    $scope.update = function() {
      var role = $scope.role;
      role.$update(function() {
        $location.path('roles/' + role._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.clearRole = function() {
      $scope.rol.roleName = '';
    };
/*	$scope.find = function() {
			pageAuthentication.shouldRender( 'Roles ').then(function(res){
				$scope.rolesPageVisible = res;
			});
			$scope.roles = Roles.query(function(){
			$scope.rol = { 'roleName': '' };
			$scope.addRoleclicked = false;
			$scope.error = false;
				//$scope.savedSuccessfully = false;
			});
		};*/
    $scope.findOne = function() {
      $scope.role = RolesService.get({
        roleId: $stateParams.roleId
      });
    };

    $scope.focus = function() {
      $scope.error = false;
      $scope.savedSuccessfully = false;
    };

    $scope.addRolebuttonclicked = function() {
      $scope.addRoleclicked = !$scope.addRoleclicked;
      $scope.focus();
    };
  }
}());
