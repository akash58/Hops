(function () {
  'use strict';

  angular
    .module('pages')
    .controller('PagesController', PagesController);

  PagesController.$inject = ['$scope', '$stateParams', '$location', 'PagesService', 'RolesService', 'Authentication', '$q', 'Notification'];

  function PagesController($scope, $stateParams, $location, PagesService, RolesService, Authentication, $q, Notification) {
   // var vm = this;

    $scope.authentication = Authentication;

    $scope.pages = PagesService.query();
    //	console.log($scope.pages);
    $scope.roles = [];
    $scope.updatePage = function(page) {
      var sendPage = new PagesService({
        _id: page._id,
        roles: page.roles
      });

      sendPage.$update(function (success) {
        Notification.success('Page Updated!');
      }, function (err) {
        Notification.error(err);
      });
      $scope.savedSuccessfully = true;
    };
	/** ************************ update pages role code ends here *************************************/
	/** *****************Assigning the role for the pages code *******************/
    $scope.updatePageRole = function(page) {
				// add roles
      for (var i in page.roles) {
        if (page.roles.indexOf(page.roles[i]) === -1) {
          page.roles.push(page.Models.lists.Roles_Authorized[i]);
        }
      }
			// remove roles
      for (var j in page.roles) {
        if (page.roles.indexOf(page.roles[j]) === -1) {
          page.roles.splice(j, 1);
        }
      }
			// $scope.test=page;
      $scope.updatePage(page);
    };

    /* $scope.itemDoubleClicked = function(item, listName, selected, pageID) {
			// $scope.test='items:'+item+'\n\n\nlistName:'+listName+'\n\n\nselected:'+selected+'\n\n\nuserId:'+pageID;
			// $scope.test=$scope.users;
      for (var a = 0; a < $scope.pages.length; a++) {
        if ($scope.pages[a]._id === pageID) {
          if (listName === 'Available') {
            if (item === selected) {
              $scope.pages[a].Models.lists.Roles_Authorized.push(selected);
              $scope.pages[a].Models.lists.Available.splice($scope.pages[a].Models.lists.Available.indexOf(selected), 1);
            }
          } else if (listName === 'Roles_Authorized') {
            if (item === selected) {
              $scope.pages[a].Models.lists.Available.push(selected);
              $scope.pages[a].Models.lists.Roles_Authorized.splice($scope.pages[a].Models.lists.Roles_Authorized.indexOf(selected), 1);
            }
          }
        }
      }
    };*/
/**	**********************Assign the role for the pages codes ends here **************************/
    $scope.clickPage = function(page) {
      if ($scope.activePage === page.pageName)
        $scope.activePage = '';
      else {
        $scope.activePage = page.pageName;
        $scope.error = false;
			// $scope.refreshUsers();
        $scope.savedSuccessfully = false;
      }
    };

    /* $scope.refreshPageManagements = function() {
      for (var i = 0; i < $scope.pages.length; i++) {
        $scope.pages[i].Models = {
          selected: null,
          lists: { 'Available': [], 'Roles_Authorized': [] }
        };
        $scope.selectedRoles = [];

        for (var j = 0; j < $scope.pages[i].roles.length; j++) {
          $scope.pages[i].Models.lists.Roles_Authorized.push($scope.pages[i].roles[j]);
          $scope.selectedRoles.push($scope.pages[i].roles[j]);
        }
        for (var k = 0; k < $scope.roles.length; k++) {
          if ($scope.selectedRoles.indexOf($scope.roles[k].roleName) === -1)
          $scope.pages[i].Models.lists.Available.push($scope.roles[k].roleName);
        }
      }

    };*/

    /* $scope.find = function() {

			pageAuthentication.shouldRender('Page Management').then(function(res){
      $scope.pageVisible = true;
			});
			$scope.test='test';

      $scope.pages = PagesService.query(function() {
        $scope.roles = RolesService.query(function() {
          $scope.refreshPageManagements();
        });
      });
    };*/

   /* $scope.addPagebuttonclicked = function() {
      $scope.addPageclicked = !$scope.addPageclicked;
		};*/

    $scope.queryRoles = function(query) {
      var deferred = $q.defer();
      RolesService.query({ roleName: query }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.transformChip = function(chip) {
      if (angular.isObject(chip) || chip.roleName) {
        return chip.roleName;
      }
    };
   /* $scope.findOne = function() {
      $scope.page = RolesService.get({
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
    };*/
  }
}());
