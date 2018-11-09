'use strict';

angular.module('specdescs').controller('SpecDescsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Specdescs', 'Specvalues', 'Products',
  function($scope, $stateParams, $location, Authentication, Specdescs, Specvalues, Products) {
    $scope.authentication = Authentication;

    $scope.createSpecdesc = function(component) {
      var specdesc = new Specdescs({
        specificationDescription: $scope.specd.specificationDescription
      });

      specdesc.component = component;

      specdesc.$save(function(response) {
        $scope.products = Products.query(function() {
          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].component === component._id)
              $scope.addSpecValue($scope.products[i]._id, specdesc._id);
          }
          $scope.savedSuccessfullyDesc = true;
          $scope.specd.specificationDescription = '';
          $scope.specdescs = Specdescs.query();
        });
      }, function(errorResponse) {
        $scope.errorDesc = errorResponse.data.message;
      });
    };

    $scope.addSpecValue = function(productId, specdescId) {
      var specvalue = new Specvalues({
        product: productId,
        specdesc: specdescId,
        specificationValue: ''
      });

      specvalue.$save(
        function(response) {
        // on success
        }, function(errorResponse) {
        // on failure
        $scope.errorDesc = 'Please report error in creating Specification Values for addition of Specification Description due to : ' + errorResponse.data.message;
      });
    };

    $scope.updateSpecDesc = function(specdesc) {

      var sendSpecdesc = new Specdescs({
        _id: specdesc._id,
        specificationDescription: specdesc.specificationDescription,
        user: $scope.authentication.user._id,
        created: Date.now()
      });

      sendSpecdesc.$update(function() {
        $scope.updatedSuccessfullySpecdesc = true;
        specdesc.editButtonClicked = false;
        $scope.errorUpdateSpecdesc = '';
      }, function(errorResponse) {
        specdesc.specificationDescription = $scope.activeSpecificationDescription;
        $scope.errorUpdateSpecdesc = errorResponse.data.message;
        $scope.updatedSuccessfullySpecdesc = '';
      });
    };

    $scope.find = function() {
      $scope.specd = { specificationDescription: '' };
      $scope.specdescs = Specdescs.query();
      $scope.updatedSuccessfullySpecdesc = false;
    };

    $scope.findOne = function() {
      $scope.specdesc = Specdescs.get({
        specdescId: $stateParams.specdescId
      });
    };

    $scope.addSpecDescButtonClicked = function() {
      $scope.addSpecDescClicked = !$scope.addSpecDescClicked;
      $scope.errorDesc = false;
      $scope.savedSuccessfullyDesc = false;
    };

    $scope.focusDesc = function() {
      $scope.errorDesc = false;
      $scope.savedSuccessfullyDesc = false;
      $scope.updatedSuccessfullySpecdesc = false;
      $scope.errorUpdateSpecdesc = false;
    };

    $scope.savedSuccessfullyDesc = false;
    $scope.addSpecDescClicked = false;

    $scope.editButtonClicked = function(specdesc) {
      specdesc.editButtonClicked = true;
      $scope.focusDesc();
    };

    $scope.activespecs = function(specdesc) {
      $scope.activeSpec = specdesc._id;
      $scope.activeSpecificationDescription = specdesc.specificationDescription;

      for (var k = 0; k < $scope.specdescs.length; k++) {
        if ($scope.specdescs[k]._id === specdesc._id) {
          $scope.specdescs[k].editButtonClicked = true;
        } else {
          $scope.specdescs[k].editButtonClicked = false;
        }
      }
    };

    /* $scope.editActiveSpecDes = function(specdesc){
      $scope.activespecs(specdesc,function(specdesc){
        $scope.editButtonClicked(specdesc);
      });
    }; */

    $scope.cancleSpec = function(specdesc) {
      // $scope.test= specdesc;
      specdesc.editButtonClicked = false;
      specdesc.specificationDescription = $scope.activeSpecificationDescription;
    };
  }
]);

