'use strict';

angular.module('components').controller('ComponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Components', 'filterFilter', 'Notification',
  function($scope, $stateParams, $location, Authentication, Components, filterFilter, Notification) {
    // $scope.authentication = Authentication;
    var vm = this;
    vm.authentication = Authentication;
    vm.Components = Components;
    vm.error = null;
    vm.form = {};

    $scope.authBeforePage = function(callback) {
      $scope.authentication = Authentication;
      if (callback) callback();
    };

    $scope.createComponent = function() {
      var component = new Components({
        componentTypeName: $scope.comp.componentTypeName
      });
      // console.log(component);
      component.$save(function(response) {
        // $scope.componentForm.$setPristine();
        // vm.componentForm.componentTypeName.$touched = false;
        // vm.componentForm.componentTypeName.$valid = false;
        $scope.savedSuccessfully = true;
        $scope.errorComponent = '';
        $scope.comp.componentTypeName = '';
        Notification.success('Component ' + response.componentTypeName + ' is created');
        // $scope.componentForm.componentTypeName.$touched = false;
        // $scope.componentForm.componentTypeName.$dirty = false;
        $scope.components = Components.query(function() {
          $scope.pageChangedComp($scope.searchTextComp.txt);

        });
      }, function(errorResponse) {
        $scope.errorComponent = errorResponse.data.message;
        Notification.error($scope.errorComponent);
        // $scope.savedSuccessfully = '';
      });

    };

    $scope.remove = function(component) {
      if (component) {
        component.$remove();

        for (var i in $scope.components) {
          if ($scope.components[i] === component) {
            $scope.components.splice(i, 1);
          }
        }
      } else {
        $scope.component.$remove(function() {
          $location.path('components');
        });
      }
    };

    $scope.update = function(component) {
      component.componentTypeName = $scope.comp.updateCompName;
      var sendComponent = new Components({
        _id: component._id,
        componentTypeName: component.componentTypeName,
        user: $scope.authentication.user._id,
        created: Date.now()
      });

      sendComponent.$update(function() {
        // $location.path('components/' + component._id);
        $scope.updatedSuccessfullyComponent = true;
        component.editingComponentName = false;
      }, function(errorResponse) {
        component.componentTypeName = $scope.activeComponentName;
        if (errorResponse.data.message === 'ComponentTypeName already exists')
          $scope.error = 'Game Type Name Already Exists';
        else if (errorResponse.data.message === 'Component Type Name cannot be blank')
          $scope.error = 'Game Type Name cannot be blank';
        else $scope.error = errorResponse.data.message;
      });
    };

    $scope.focusCompUpd = function() {
      $scope.updatedSuccessfullyComponent = false;
      $scope.error = false;
    };

    // $scope.clearComponent = function() {
    //   $scope.comp.componentTypeName = '';
    // };

    $scope.find = function() {
      $scope.authBeforePage(function() {
        // $scope.pages=Pages.query(function(){
        // $scope.componentPageVisible = $scope.shouldRender();
        // shouldRender('Game Types');
        // });
        // pageAuthentication.shouldRender('Game Types').then(function(res){
        // $scope.test=res;
        // $scope.componentPageVisible=res;
        $scope.componentPageVisible = true;
        // });
      });

      $scope.components = Components.query(function() {
        $scope.comp = { 'componentTypeName': '' };
        $scope.addComponentclicked = false;
        $scope.error = false;
        $scope.savedSuccessfully = false;
        $scope.itemsPerPageHardCoded = 10; // hard coded in the current pagination
        $scope.curPageComponent = { currentPage: 1 };
        $scope.searchTextComp = { text: '' };
        $scope.maxSize = 5;
        $scope.pageChangedComp($scope.searchTextComp.txt);
      });
    };

    /* $scope.queryPages=function(){
      $scope.pages=Pages.query(function(){
        $scope.componentPageVisible = $scope.shouldRender();
      });
    }; */

/** ********************************* User Role coding  ****************************************/
    $scope.shouldRender = function() {
      var result = false;
      for (var p = 0; p < $scope.pages.length; p++) {
        if ($scope.pages[p].pageName === 'Game Types') {
          // $scope.page = $scope.pages[p];
          for (var i = 0; i < $scope.authentication.user.roles.length; i++) {
            for (var j = 0; j < $scope.pages[p].roles.length; j++) {
              if ($scope.pages[p].roles[j] === $scope.authentication.user.roles[i]) {
                result = true;
                break;
              }
            } if (result) break;
          }
          break;
        }
      }

      return result;

      /* for (var p = 0; p < $scope.pages.length; p++){
          if ($scope.pages[p].pageName === 'Game Types'){
            $scope.page = $scope.pages[p];
            break;
          }
        }
        //debugger;
          //$scope.test = $scope.page;
        var i , j = 0;
        for ( i = 0; i < $scope.authentication.user.roles.length;i++) {
          for ( j =0; j < $scope.page.roles.length; j++) {
            if ($scope.page.roles[j] === $scope.authentication.user.roles[i]) {
              return true;
            }
          }
        }
      return false;*/
    };

/** ********************************* User Role coding ends ****************************************/
    // $scope.findOne = function() {
    //  $scope.component = Components.get({
    //    componentId: $stateParams.componentId
    //  });
    // };

    $scope.focus = function() {
      $scope.error = false;
      $scope.savedSuccessfully = false;
    };

    $scope.clickComponent = function(component) {
      if ($scope.activeComponent === component._id)
        $scope.activeComponent = '';
      else {
        $scope.activeComponent = component._id;
        $scope.activeComponentName = component.componentTypeName;
      }
      for (var i = 0; i < $scope.components.length; i++) {
        $scope.components[i].editingComponentName = false;
      }
      /* for(var k = 0; k < $scope.specdescs.length;k++){
         $scope.specdescs[k].editButtonClicked = false;
      } */
      $scope.focus();
      $scope.focusCompUpd();
    };

    $scope.addComponentbuttonclicked = function() {
      $scope.addComponentclicked = !$scope.addComponentclicked;
      $scope.focus();
    };

    $scope.editComponentButtonClicked = function(component) {
      $scope.comp.updateCompName = component.componentTypeName;
      component.editingComponentName = true;
      $scope.focus();
      $scope.focusCompUpd();
    };

/** **********************************************pagination*******************************************************/

    $scope.pageChangedComp = function(searchText) {

      $scope.componentsWithSearchText = filterFilter($scope.components, { componentTypeName: searchText });
      $scope.totalItemsComponent = { items: $scope.componentsWithSearchText.length };
      $scope.componentsOnPage = [];
      $scope.indexStart = ($scope.curPageComponent.currentPage - 1) * $scope.itemsPerPageHardCoded;
      $scope.indexEnd = Math.min(($scope.curPageComponent.currentPage) * $scope.itemsPerPageHardCoded, $scope.componentsWithSearchText.length);
      for (var i = (($scope.curPageComponent.currentPage - 1) * $scope.itemsPerPageHardCoded); i < Math.min(($scope.curPageComponent.currentPage) * $scope.itemsPerPageHardCoded, $scope.componentsWithSearchText.length); i++) {
        $scope.componentsOnPage.push($scope.componentsWithSearchText[i]);
      }
    };
  }
]);

