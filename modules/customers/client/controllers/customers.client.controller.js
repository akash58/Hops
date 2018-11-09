(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'customerResolve', 'filterFilter', 'CustomersService', 'Notification'];

  function CustomersController ($scope, $state, $window, Authentication, customer, filterFilter, CustomersService, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    // vm.searchCustomer = '';
    vm.initialize = function() {
      vm.limit = 10;
      vm.curPageCustomer = { page: 1 };
      vm.searchTextCust = { text: '' };
      vm.maxSize = 5;
      vm.pageChangedCust(vm.searchTextCust.txt);
      vm.editing = false;
      vm.cust = {
        customerName: '',
        mobile: '',
        email: '',
        address: '',
        customerId: ''
      };
      // vm.searchText = '';
      vm.edit = { customerName: '', customerId: '', mobile: '', email: '', address: '' };
      // customerPagination(vm.searchText);
    };
    // vm.save = save;

    // Remove existing Customer
    /* function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.customer.$remove($state.go('customers.list'));
      }
    }*/

    // Save Customer
    vm.createCustomer = function() {
      var customer = new CustomersService({
        customerName: vm.cust.customerName,
        mobile: vm.cust.mobile,
        email: vm.cust.email,
        address: vm.cust.address,
        customerId: vm.cust.customerId
      });
      customer.$save(function(response) {
        vm.savedCustomerSuccessfully = true;
        vm.errorCustomer = '';
        vm.customerForm.$setPristine();
        vm.customerForm.CustomerId.$touched = false;
        vm.customerForm.CustomerId.$valid = false;
        vm.customerForm.CustomerName.$touched = false;
        vm.customerForm.CustomerName.$valid = false;
        vm.customerForm.MobileNumber.$touched = false;
        vm.customerForm.MobileNumber.$valid = false;
        vm.customerForm.Email.$touched = false;
        vm.customerForm.Email.$valid = false;
        vm.customerForm.Address.$touched = false;
        vm.customerForm.Address.$valid = false;
        vm.cust.customerName = '';
        vm.cust.mobile = '';
        vm.cust.email = '';
        vm.cust.address = '';
        vm.cust.customerId = '';
        // customerPagination(vm.searchText);
        vm.pageChangedCust(vm.searchTextCust.txt);
        Notification.success('Customer ' + vm.cust.customerName + ' is created');
      }, function(errorResponse) {
        vm.errorCustomer = errorResponse.data.message;
        /* vm.savedCustomerSuccessfully = '';*/
        Notification.error(vm.errorCustomer);
      });
    };

    vm.deleteCustomer = function(customer) {
      if ($window.confirm('Are you sure you want to delete customer by Name: ' + customer.customerName + ' ?')) {
        customer.active = false;
        customer.$update(function (response) {
          // $setPristine();
          // customerPagination(vm.searchText);
          vm.pageChangedCust(vm.searchTextCust.txt);
          Notification.success('Customer by Name ' + response.customerName + ' is Delete successfully !');
        }, function (errorResponse) {
          console.log(errorResponse);
          vm.errorFoodType = errorResponse.data.message;
          Notification.error(vm.errorFoodType);
        });
      }
    };

    vm.clickCustomer = function(customer) {
      if (vm.activeCustomerId === customer._id) {
        vm.activeCustomerId = '';
        // vm.activeCustomer = '';
        // vm.editing = true;
      } else {
        vm.editing = false;
        vm.activeCustomerId = customer._id;
        vm.edit.customerName = customer.customerName;
        vm.edit.customerId = customer.customerId;
        vm.edit.mobile = customer.mobile;
        vm.edit.address = customer.address;
        vm.edit.email = customer.email;
        // vm.activeCustomer = customer.customerName;
      }
      /* for(var i=0;i<vm.customers.length;i++){
        vm.customers[i].customerEditable=false;
      }
      vm.focusUpdateCustomer();
      vm.focusUpdateCustomer();*/
    };

    vm.editCustomer = function(customer) {
      vm.editing = true;
      vm.edit.customerName = customer.customerName;
      vm.edit.customerId = customer.customerId;
      vm.edit.mobile = customer.mobile;
      vm.edit.address = customer.address;
      vm.edit.email = customer.email;
    };
    vm.cancelEditCustomer = function(customer) {
      vm.editing = false;
      vm.edit.customerName = customer.customerName;
      vm.edit.customerId = customer.customerId;
      vm.edit.mobile = customer.mobile;
      vm.edit.address = customer.address;
      vm.edit.email = customer.email;
    };

    vm.updateCustomer = function(customer) {
      vm.editing = false;

      customer.customerName = vm.edit.customerName;
      customer.customerId = vm.edit.customerId;
      customer.mobile = vm.edit.mobile;
      customer.email = vm.edit.email;
      customer.address = vm.edit.address;
      // customer.customerId = vm.edit.customerId;

      customer.$update(function (updatedCustomer) {
        Notification.success('Customer by Name ' + updatedCustomer.customerName + ' is Updated successfully !');
      }, function (errorResponse) {
        vm.errorCustomer = errorResponse.data.message;
        Notification.error(vm.errorCustomer);
      });
    };

    /* vm.focusUpdateCustomer = function() {
      vm.errorupdate = false;
      vm.updatedSuccessfullyCustomer = false;
    };

    vm.editButtonClicked = function(customer) {
      vm.editing = true;
      vm.editCust = { customerName: customer.customerName, mobile: customer.mobile, email: customer.email, address: customer.address, customerId: customer.customerId };
      vm.focusCustomer();
      vm.focusUpdateCustomer();
    };

    vm.cancel = function(customer) {
      vm.editing = false;
      customer.customerEditable = false;
    };

    vm.updateCustomer = function(customer) {
      var sendCustomer = new CustomersService({
        _id: customer._id,
        customerName: vm.editCust.customerName,
        user: vm.authentication.user._id,
        mobile: vm.editCust.mobile,
        email: vm.editCust.email,
        created: Date.now(),
        address: vm.editCust.address,
        customerId: vm.editCust.customerId
      });
      sendCustomer.$update(function() {
        vm.updatedSuccessfullyCustomer = true;
        customer.customerEditable = true;
        vm.activeCustomer = customer.customerName;
        customer.customerName = vm.editCust.customerName;
        customer.mobile = vm.editCust.mobile;
        customer.email = vm.editCust.email;
        customer.address = vm.editCust.address;
        customer.customerId = vm.editCust.customerId;
      }, function(errorResponse) {
        vm.errorupdate = errorResponse.data.message;
      });
    };*/

    /* function customerPagination(searchCustomer) {
      CustomersService.query({ customerName: searchCustomer }, function(res) {
        vm.customers = res;
      });
    }*/
    vm.pageChangedCust = function(searchText) {
      vm.getCustomerCount = CustomersService.get({ customerId: 'count', customerName: searchText }, function() {
        vm.totalItemsCustomer = vm.getCustomerCount;
        vm.customersOnPage = CustomersService.query({ page: vm.curPageCustomer.page, limit: vm.limit, customerName: searchText }, function() {
          vm.indexStartCustomer = (vm.curPageCustomer.page - 1) * vm.limit;
          vm.indexEndCustomer = Math.min((vm.curPageCustomer.page) * vm.limit, vm.totalItemsCustomer.count);
        });
      });
    };
  }
}());
