(function () {
  'use strict';

  // Systemparameters controller
  angular
    .module('systemparameters')
    .controller('SystemparametersController', SystemparametersController);

  SystemparametersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'systemparameterResolve', 'Notification', 'SystemparametersService'];

  function SystemparametersController ($scope, $state, $window, Authentication, systemparameter, Notification, SystemparametersService) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.systemparameter = systemparameter;
    // vm.error = null;
    vm.form = {};

    $scope.systemparameters = SystemparametersService.query();

    $scope.initialize = function () {
      $scope.limit = 10;
      $scope.curPageSysParam = { page: 1 };
      $scope.searchTextSysParam = { text: '' };
      $scope.maxSize = 5;
      $scope.pageChangedSysParam($scope.searchTextSysParam.txt);

    // vm.searchSystemparameter = '';
      // systemParameterPagination(vm.searchTextSysParam);
      vm.sysp = { sysParamName: '', value: '', defaultValue: '', description: '' };
    // vm.remove = remove;
    // vm.save = save;
    // Remove existing Systemparameter
    /* function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.systemparameter.$remove($state.go('systemparameters.list'));
      }
    }*/
    };
    // Save Systemparameter
    $scope.createSysParam = function(callback) {
      var systemparameter = new SystemparametersService({
        systemParameterName: $scope.sysp.sysParamName,
        defaultValue: $scope.sysp.defaultValue,
        value: $scope.sysp.value,
        description: $scope.sysp.description
      });
      systemparameter.$save(function(response) {
        $scope.sysparameterForm.$setPristine();
        $scope.sysparameterForm.sysParamName.$touched = false;
        $scope.sysparameterForm.sysParamName.$valid = false;
        $scope.sysparameterForm.dvalue.$touched = false;
        $scope.sysparameterForm.dvalue.$valid = false;
        $scope.sysparameterForm.value.$touched = false;
        $scope.sysparameterForm.value.$valid = false;
        $scope.sysparameterForm.description.$touched = false;
        $scope.sysparameterForm.description.$valid = false;
        $scope.savedSysParamSuccessfully = true;
        $scope.errorSysParam = '';
        $scope.sysp.sysParamName = '';
        $scope.sysp.defaultValue = '';
        $scope.sysp.value = '';
        $scope.sysp.description = '';
        $scope.pageChangedSysParam($scope.searchTextSysParam.txt);
        // systemParameterPagination(vm.searchSystemparameter);
        Notification.success('Systemparameter ' + $scope.sysp.sysParamName + ' is created');
      }, function(errorResponse) {
        $scope.errorSysParam = errorResponse.data.message;
        // $scope.savedSysParamSuccessfully = '';
        Notification.error($scope.errorSysParam);
      });
    };
    // console.log(vm.sysParam);
    $scope.updateSysParam = function(sysParam) {
      if (sysParam.value === '' || null)
        sysParam.errorUpdateSysParam = 'Please Enter A Value To Update It.';
      else {
          // if(sysParam.user){
          //   sysParam.user = sysParam.user._id || sysParam.user ;
          // }else{
          //   sysParam.user = $scope.authentication.user._id || $scope.authentication.user;
          // }

        sysParam.$update(function (updatedSystemparameter) {
          Notification.success('Systemparameter ' + updatedSystemparameter.value + ' is Updated successfully !');
        }, function (errorResponse) {
          vm.errorCustomer = errorResponse.data.message;
          Notification.error(vm.errorCustomer);
        });
      }
      /* if(sysParam.value === '' || null)
        sysParam.errorUpdateSysParam = 'Please Enter A Value To Update It.';
      else{
        if(sysParam.user)
          sysParam.user = sysParam.user._id || sysParam.user ;
        else
          sysParam.user = $scope.authentication.user._id || $scope.authentication.user;
        sysParam.$update(function(){
              sysParam.updateSysParamSuccessful = true;
            },function(errorResponse){
              sysParam.errorUpdateSysParam = errorResponse.data.message;
            }
        );
      }*/
    };
    $scope.focusUpdateSysParam = function(sysParam) {
      sysParam.updateSysParamSuccessful = false;
      sysParam.errorUpdateSysParam = '';
    };
    $scope.resetSysParams = function() {
      var d = $window.confirm('Please Confirm: Reset ALL System Parameters to defaults!!');
      if (d === true) {
        $scope.executeResetSysParams();
      }
    };

    $scope.executeResetSysParams = function() {
      for (var i = 0; i < $scope.sysParamsOnPage; i++) {
        // console.log(i);
        $scope.sysParamsOnPage[i].value = $scope.sysParamsOnPage[i].defaultValue;
        $scope.sysParamsOnPage[i].$update(function(res) {
          // console.log(res);
          // Notification.success('SystemParameter are set to default');
        }, function(error) {
          Notification.error(error);
        });
      }
    };

     /* $scope.executeResetSysParams = function() {
      for (var i in vm.systemparameters) {
        if (vm.systemparameters.hasOwnProperty(i)) {
          vm.systemparameters[i].value = vm.systemparameters[i].defaultValue;
          vm.systemparameters[i].$update(function(res) {
            // console.log(res);
            // Notification.success('SystemParameter are set to default');
          }, function(error) {
            Notification.error(error);
          });
        }
      }
    };*/

    $scope.pageChangedSysParam = function(searchText) {
      $scope.getsysParamsCount = SystemparametersService.get({ systemparameterId: 'count', systemParameterName: searchText }, function() {
        $scope.totalItemsSysParam = $scope.getsysParamsCount;
        $scope.sysParamsOnPage = SystemparametersService.query({ page: $scope.curPageSysParam.page, limit: $scope.limit, systemParameterName: searchText }, function(sysParamsOnPage) {
          $scope.indexStartSysParam = ($scope.curPageSysParam.page - 1) * $scope.limit;
          $scope.indexEndSysParam = Math.min(($scope.curPageSysParam.page) * $scope.limit, $scope.totalItemsSysParam.count);
          $scope.sysParamsOnPage = sysParamsOnPage.splice($scope.indexStartSysParam, $scope.limit);
        });
      });
      /* SystemparametersService.query({ sysParamName: searchSystemparameter }, function(res) {
        vm.systemparameters = res;
      });*/
    };

    /* function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.systemparameterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.systemparameter._id) {
        vm.systemparameter.$update(successCallback, errorCallback);
      } else {
        vm.systemparameter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('systemparameters.view', {
          systemparameterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }*/
  }
}());
