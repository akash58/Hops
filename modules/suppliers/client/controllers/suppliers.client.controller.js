(function () {
  'use strict';

  // Suppliers controller
  angular
    .module('suppliers')
    .controller('SuppliersController', SuppliersController);

  SuppliersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'supplierResolve', 'filterFilter', 'SuppliersService', 'Notification'];

  function SuppliersController ($scope, $state, $window, Authentication, supplier, filterFilter, SuppliersService, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.supplier = supplier;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    $scope.initialize = function() {
      $scope.curPageSupplier = { page: 1 };
      $scope.searchTextSupp = { text: '' };
      $scope.maxSize = 5;
      $scope.pageChangedSupp($scope.searchTextSupp.txt);
      $scope.limit = 10;
      // vm.searchSupplier = '';
      vm.editing = false;
      vm.supp = {
        companyName: '',
        telephone: '',
        contactName: '',
        mobile: '',
        designation: '',
        email: '',
        address: ''
      };
      // vm.searchText = '';
      vm.edit = { companyName: '', telephone: '', contactName: '', mobile: '', designation: '', email: '',
        address: '' };
      // supplierPagination(vm.searchSupplier);
      // vm.save = save;
    };
    // Remove existing Supplier
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.supplier.$remove($state.go('suppliers.list'));
      }
    }

    // Save Supplier
    $scope.createSupplier = function() {
      var supplier = new SuppliersService({
        companyName: $scope.supp.companyName,
        telephone: $scope.supp.telephone,
        contactName: $scope.supp.contactName,
        mobile: $scope.supp.mobile,
        designation: $scope.supp.designation,
        email: $scope.supp.email,
        address: $scope.supp.address
      });
      supplier.$save(function(response) {
        $scope.supplierForm.$setPristine();
        $scope.supplierForm.CompanyName.$touched = false;
        $scope.supplierForm.CompanyName.$valid = false;
        $scope.supplierForm.ContactName.$touched = false;
        $scope.supplierForm.ContactName.$valid = false;
        $scope.supplierForm.Designation.$touched = false;
        $scope.supplierForm.Designation.$valid = false;
        $scope.supplierForm.MobileNumber.$touched = false;
        $scope.supplierForm.MobileNumber.$valid = false;
        $scope.supplierForm.TelephoneNumber.$touched = false;
        $scope.supplierForm.TelephoneNumber.$valid = false;
        $scope.supplierForm.Email.$touched = false;
        $scope.supplierForm.Email.$valid = false;
        $scope.supplierForm.Address.$touched = false;
        $scope.supplierForm.Address.$valid = false;


        Notification.success('Supplier ' + $scope.supp.companyName + ' is created');
        $scope.supp.companyName = '';
        $scope.supp.telephone = '';
        $scope.supp.contactName = '';
        $scope.supp.mobile = '';
        $scope.supp.designation = '';
        $scope.supp.email = '';
        $scope.supp.address = '';
        $scope.errorSupplier = '';
        $scope.pageChangedSupp($scope.searchTextSupp.txt);
        // supplierPagination(vm.searchSupplier);
      }, function(errorResponse) {
        $scope.errorSupplier = errorResponse.data.message;
        // $scope.savedSupplierSuccessfully = '';
        Notification.error($scope.errorSupplier);
      });
    };

    /* vm.deleteSupplier = function(supplier){
      var d = window.confirm('Are You Sure You Want To Deactivate!');
      if (d === true){
        for (var i in vm.suppliersOnPage) {
          if (vm.suppliersOnPage[i]._id === supplier._id) {
            vm.suppliersOnPage.splice(i, 1);
          }
        }
        supplier.$remove();
        $scope.refresh();
      }
    };*/

    vm.deleteSupplier = function(supplier) {
      if ($window.confirm('Are you sure you want to delete supplier by Name: ' + supplier.companyName + ' ?')) {
        supplier.active = false;
        supplier.$update(function (response) {
          $scope.pageChangedSupp($scope.searchTextSupp.txt);
          // $setPristine();
          // supplierPagination(vm.searchSupplier);
          Notification.success('Supplier by Name ' + response.companyName + ' is Delete successfully !');
        }, function (errorResponse) {
          console.log(errorResponse);
          vm.errorSupplier = errorResponse.data.message;
          Notification.error(vm.errorSupplier);
        });
      }
    };
    /* vm.clickSupplier = function(supplier) {
      if (vm.activeSupplier === supplier.companyName) {
        vm.activeSupplier = '';
      }
      vm.editing = true;
      } else {
        vm.editing = false;
        vm.activeSupplier = supplier.companyName;
      }
    };*/
    vm.clickSupplier = function(supplier) {
      if (vm.activeSupplierId === supplier._id) {
        vm.activeSupplierId = '';
      // vm.editing = true;
      } else {
        vm.editing = false;
        vm.activeSupplierId = supplier._id;
        vm.edit.companyName = supplier.companyName;
        vm.edit.telephone = supplier.telephone;
        vm.edit.contactName = supplier.contactName;
        vm.edit.mobile = supplier.mobile;
        vm.edit.designation = supplier.designation;
        vm.edit.email = supplier.email;
        vm.edit.address = supplier.address;
      }
    };

    vm.editSupplier = function(supplier) {
      vm.editing = true;
      vm.edit.companyName = supplier.companyName;
      vm.edit.telephone = supplier.telephone;
      vm.edit.contactName = supplier.contactName;
      vm.edit.mobile = supplier.mobile;
      vm.edit.designation = supplier.designation;
      vm.edit.email = supplier.email;
      vm.edit.address = supplier.address;
    };
    vm.cancelEditSupplier = function(supplier) {
      vm.editing = false;
      vm.edit.companyName = supplier.companyName;
      vm.edit.telephone = supplier.telephone;
      vm.edit.mobile = supplier.mobile;
      vm.edit.address = supplier.address;
      vm.edit.designation = supplier.designation;
      vm.edit.email = supplier.email;
      vm.edit.address = supplier.address;
    };

    vm.updateSupplier = function(supplier) {
      vm.editing = false;

      supplier.companyName = vm.edit.companyName;
      supplier.telephone = vm.edit.telephone;
      supplier.contactName = vm.edit.contactName;
      supplier.mobile = vm.edit.mobile;
      supplier.designation = vm.edit.designation;
      supplier.email = vm.edit.email;
      supplier.address = vm.edit.address;

      supplier.$update(function (updatedSupplier) {
        Notification.success('Supplier by Name ' + updatedSupplier.companyName + ' is Updated successfully !');
      }, function (errorResponse) {
        vm.errorSupplier = errorResponse.data.message;
        Notification.error(vm.errorSupplier);
      });
    };

    /* function supplierPagination(searchSupplier) {
      SuppliersService.query({ companyName: searchSupplier }, function(res) {
        vm.suppliers = res;
      });
    }*/
    $scope.pageChangedSupp = function(searchText) {
      $scope.getSupplierCount = SuppliersService.get({ supplierId: 'count', companyName: searchText }, function() {
        $scope.totalItemsSupplier = $scope.getSupplierCount;
        $scope.suppliersOnPage = SuppliersService.query({ page: $scope.curPageSupplier.page, limit: $scope.limit, companyName: searchText }, function() {
          $scope.indexStartSupp = ($scope.curPageSupplier.page - 1) * $scope.limit;
          $scope.indexEndSupp = Math.min(($scope.curPageSupplier.page) * $scope.limit, $scope.totalItemsSupplier.count);
        });
      });
    };
  }
}());
