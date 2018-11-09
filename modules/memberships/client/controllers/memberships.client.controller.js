(function () {
  'use strict';

  // Memberships controller
  angular
    .module('memberships')
    .controller('MembershipsController', MembershipsController);

  MembershipsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'membershipResolve', 'CustomersService', '$q', 'MembershipsService', 'SystemparametersService', 'filterFilter', 'IncrementParametersService', 'Notification', 'MembershipactivitiesService', 'BillsService', 'TablesService', 'BillmembershipsService'];

  function MembershipsController ($scope, $state, $window, Authentication, membership, CustomersService, $q, MembershipsService, SystemparametersService, filterFilter, IncrementParametersService, Notification, MembershipactivitiesService, BillsService, TablesService, BillmembershipsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.membership = membership;
    vm.error = null;
    vm.form = {};
    vm.membershipStartDate = new Date();
    vm.membershipStartDate.setUTCHours(0, 0, 0, 0);
    vm.membershipExpiryDate = new Date();
    vm.membershipExpiryDate.setUTCHours(0, 0, 0, 0);
    vm.serachMembership = '';
    vm.membershipEditer = false;
    vm.date = new Date();
    vm.date.setUTCHours(0, 0, 0, 0);
    getincrementparameter();
    paginationForMembership(vm.serachMembership);
    $scope.systemparameters = SystemparametersService.query(function(res) {
        // $scope.test = (filterFilter($scope.systemparameters, {systemParameterName : 'Service Tax'},true));
      $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
      vm.currencySymbol = $scope.currencySymbol;
      $scope.memMonthlyAmnt = (filterFilter($scope.systemparameters, { systemParameterName: 'Membership Monthly Amount' }, true)).pop().value;
      vm.payment = Number($scope.memMonthlyAmnt);
      $scope.serviceTax = (filterFilter($scope.systemparameters, { systemParameterName: 'Service Tax' }, true)).pop().value;
      $scope.membershipCgstTaxParameter = (filterFilter($scope.systemparameters, { systemParameterName: 'Membership CGST' }, true)).pop().value;
      $scope.membershipSgstTaxParameter = (filterFilter($scope.systemparameters, { systemParameterName: 'Membership SGST' }, true)).pop().value;
      $scope.membershipHsnParameter = (filterFilter($scope.systemparameters, { systemParameterName: 'Membership SAC/HSN Code' }, true)).pop().value;
      $scope.allTaxIncluded = (filterFilter($scope.systemparameters, { systemParameterName: 'Tax included in price' }, true)).pop().value;
      $scope.addressOnBill = (filterFilter($scope.systemparameters, { systemParameterName: 'Address on Bill' }, true)).pop().value;
      if ($scope.allTaxIncluded === 'Y') {
        // $scope.chargeMultiplierWithoutFood = 1 / (1 + $scope.serviceTax / 100);
        vm.membershipGst = Number(Number($scope.membershipCgstTaxParameter) + Number($scope.membershipSgstTaxParameter));
        console.log(vm.membershipGst);
        $scope.chargeMultiplierWithoutFood = 1 / (1 + Number(vm.membershipGst) / 100);
        console.log($scope.chargeMultiplierWithoutFood);
      } else {
        $scope.chargeMultiplierWithoutFood = 1;
      }
    });
    console.log($scope.systemparameters);
    function getincrementparameter() {
      vm.incrementparameters = IncrementParametersService.query(function(resopnse) {
        // console.log(resopnse.length);
        // console.log(resopnse);
        for (var i = 0; i < resopnse.length; i++) {
          if (resopnse[i].name === 'Bill Number') {
            vm.billNumber = Number(resopnse[i].value);
            vm.newBillfNo = vm.billNumber + 1;
            setIncrementParameter(resopnse[i], vm.newBillfNo);
            break;
          }
        }
      }, function(error) {

      });
    }

    function setIncrementParameter(objectToBeUpdate, value) {
      objectToBeUpdate.value = value;
      objectToBeUpdate.$update();
    }

    // vm.systemParameterData = SystemparametersService.query();


    vm.querySearchForCustomer = function(searchCustomer) {
      var deferred = $q.defer();
      CustomersService.query({ customerName: searchCustomer }, function(searchedCustomer) {
        deferred.resolve(searchedCustomer);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    vm.selectedCustomer = function(selectedCustomer) {
      if (selectedCustomer) {
        vm.customerId = Number(selectedCustomer.customerId);
      }
    };

    vm.selectedCustomerOnEdit = function(selectedCustomerOnEdit) {
      if (selectedCustomerOnEdit) {
        vm.edit.customerId = Number(selectedCustomerOnEdit.customerId);
      }
    };

    vm.searchTextChanged = function(searchTextChangd) {
      vm.customerId = '';
    };

    vm.countMonthPeriod = function(membershipPeriod) {
      if (membershipPeriod !== 0 && membershipPeriod !== '' && membershipPeriod !== null && membershipPeriod !== undefined) {
        vm.membershipExpiryDate = new Date(vm.membershipStartDate);
        vm.membershipExpiryDate.setMonth(vm.membershipStartDate.getMonth() + membershipPeriod);
        vm.payment = Number($scope.memMonthlyAmnt) * membershipPeriod;
        // $scope.total = parseFloat(Math.round(Number($scope.billPrice) + Number($scope.serviceTaxOnMembership))).toFixed(2);
        // $scope.mntAmnt = $scope.memMonthlyAmnt * vm.membershipPeriod;
        // $scope.billPrice = parseFloat(Math.round(vm.payment * $scope.chargeMultiplierWithoutFood * 100) / 100).toFixed(2);
        // $scope.serviceTaxOnMembership = parseFloat(Math.round(Number($scope.billPrice) * $scope.membershipGst) / 100).toFixed(2);
        // $scope.total = parseFloat(Math.round(Number($scope.billPrice) + Number($scope.serviceTaxOnMembership))).toFixed(2);
      } else {
        vm.membershipExpiryDate = new Date();
        vm.payment = Number($scope.memMonthlyAmnt);
      }
    };

    vm.appendMembershipFees = function() {
      $scope.mntAmnt = $scope.memMonthlyAmnt * vm.membershipPeriod;
      $scope.billPrice = parseFloat(Math.round((Number(vm.payment) * Number($scope.chargeMultiplierWithoutFood)) * 100) / 100).toFixed(2);
      console.log(Number(vm.payment));
      console.log(Number($scope.chargeMultiplierWithoutFood));
      console.log($scope.billPrice);
      // $scope.billPrice = parseFloat(Math.round(vm.payment)).toFixed(2);
      $scope.serviceTaxOnMembership = Number(parseFloat(Math.round(Number($scope.billPrice) * Number(vm.membershipGst)) / 100).toFixed(2));
      console.log($scope.serviceTaxOnMembership);

      vm.cgstOnMembership = Number(parseFloat(Math.round((Number($scope.billPrice)) * Number($scope.membershipCgstTaxParameter)) / 100).toFixed(2));
      vm.sgstOnMembership = Number(parseFloat(Math.round((Number($scope.billPrice)) * Number($scope.membershipSgstTaxParameter)) / 100).toFixed(2));
      console.log(typeof vm.cgstOnMembership);
      console.log($scope.membershipCgstTaxParameter);
      console.log(vm.sgstOnMembership);
      vm.total = parseFloat(Number(Math.round(Number($scope.billPrice) + Number(vm.cgstOnMembership + vm.sgstOnMembership)))).toFixed(2);
      console.log(vm.total);
    };

    vm.createMembership = function() {
      console.log($scope.chargeMultiplierWithoutFood);
      console.log($scope.billPrice);
      console.log(vm.total);
      vm.appendMembershipFees();
      var newMembership = new MembershipsService({
        billNumber: vm.billNumber,
        customer: vm.customerName._id,
        membershipStartDate: vm.membershipStartDate,
        membershipExpiry: vm.membershipExpiryDate,
        membershipPeriod: vm.membershipPeriod,
        membershipAmount: vm.total,
        description: vm.description
      });
      newMembership.$save(function(createSuccess) {
        Notification.success('New Membership is Created Successfully');

        $scope.createMembershipActivity(createSuccess);
        paginationForMembership(vm.serachMembership);
      }, function(err) {
        Notification.error(err);
      });
    };
    vm.membershipClicked = function(membershipClicked) {
      if (vm.activeMembership === membershipClicked._id) {
        vm.activeMembership = '';
        vm.membershipEditer = false;
      } else {
        vm.activeMembership = membershipClicked._id;
        // console.log(membershipClicked);
        vm.edit = { customerId: Number(membershipClicked.customer.customerId), customerName: membershipClicked.customer, membershipPeriod: Number(membershipClicked.membershipPeriod), membershipStartDate: new Date(membershipClicked.membershipStartDate), membershipExpiryDate: new Date(membershipClicked.membershipExpiry), description: membershipClicked.description, payment: membershipClicked.membershipAmount };
        // console.log(vm.edit);
      }
    };
    vm.searchTextChangedOnEdit = function(searchTextChangdOnEdit) {
      vm.edit.customerId = '';
    };
    vm.countMonthPeriodOnEdit = function(membershipPeriodForEdit, membership) {
      if (membershipPeriodForEdit !== 0 && membershipPeriodForEdit !== '' && membershipPeriodForEdit !== null && membershipPeriodForEdit !== undefined) {
        vm.edit.membershipExpiryDate = new Date(vm.edit.membershipExpiryDate.setMonth(vm.edit.membershipStartDate.getMonth() + membershipPeriodForEdit));
        vm.edit.payment = vm.edit.payment * membershipPeriodForEdit;
      } else {
        vm.edit.membershipExpiryDate = new Date(membership.membershipExpiry);
        vm.edit.payment = Number($scope.memMonthlyAmnt);
      }
    };
    vm.deleteMembership = function(membershipToBeDeleted) {
      if ($window.confirm('Are you sure you want to Delete this Membership ?')) {
        membershipToBeDeleted.active = false;
        membershipToBeDeleted.$update(function(deletedMembership) {
          Notification.success('Membership is Successfully Deleted of Bill Number ' + deletedMembership.billNumber);
        }, function(errorOnDeleting) {
          Notification.error(errorOnDeleting);
        });
      }
    };
    vm.createCustomer = function(searchTextForCustomer) {
      $state.go('customers.create');
    };
    vm.editMembership = function(membership) {
      vm.membershipEditer = true;
    };
    vm.canselEditMembership = function(membership) {
      vm.membershipEditer = false;
    };
    $scope.createMembershipActivity = function(membership) {

      var membershipactivity = new MembershipactivitiesService({
        billNumber: membership.billNumber,
        customer: membership.customer,
        dateOfBill: vm.date,
        membershipStartDate: membership.membershipStartDate,
        membershipExpiry: membership.membershipExpiry,
        membershipPeriod: membership.membershipPeriod,
        membershipAmount: membership.membershipAmount,
        billPrice: $scope.billPrice,
        cgstOnMembership: vm.cgstOnMembership,
        sgstOnMembership: vm.sgstOnMembership,
        cgstTaxPercentage: $scope.membershipCgstTaxParameter,
        sgstTaxPercentage: $scope.membershipSgstTaxParameter,
        membershipHsnParameter: $scope.membershipHsnParameter,
        description: membership.description
      });

      membershipactivity.$save(function(response) {
        TablesService.get({ availableTable: 'available' }, function(availableTableRes) {
          var table = availableTableRes._id;
          $scope.createBillForMember(membershipactivity, table);
        });
      }, function(errorResponse) {
        $scope.errorMembership = 'Please take screenshot and report this issue: Membership saved successfully but Membership Activity failed due to : ' + errorResponse.data.message;
      });
    };

    $scope.createBillForMember = function(membershipactivity, table) {
      console.log(membershipactivity);
      var memberBill = new BillsService({
        billNumber: membershipactivity.billNumber,
        table: table,
        dateOfBill: membershipactivity.dateOfBill,
        serviceChargeRate: 0,
        // vatRate: 0,
        cgstRateForMembership: membershipactivity.cgstTaxPercentage,
        sgstRateForMembership: membershipactivity.sgstTaxPercentage,
        membershipHsnParameter: membershipactivity.membershipHsnParameter,
        // serviceTaxSplitPercent: 0,
        rounding: 0,
        billTotal: membershipactivity.membershipAmount,
        extraCharge: 0,
        status: 'Billed',
        extraChargeDescription: '',
        // serviceTaxRateWithFood: 0,
        descriptionForBill: membershipactivity.description,
        discountInpercent: 0,
        discountInValue: 0,
        discountDescription: ''
      });
      memberBill.$save(function() {
        var sendBillMembership = new BillmembershipsService({
          bill: memberBill._id,
          membershipactivity: membershipactivity._id
        });
        sendBillMembership.$save();
      // };
      });
    };
    vm.updateMembership = function(membershipToBeUpdated) {
      membershipToBeUpdated.customer = vm.edit.customerName._id;
      membershipToBeUpdated.membershipStartDate = vm.edit.membershipStartDate;
      membershipToBeUpdated.membershipExpiry = vm.edit.membershipExpiryDate;
      membershipToBeUpdated.membershipPeriod = vm.edit.membershipPeriod;
      membershipToBeUpdated.membershipAmount = vm.edit.payment;
      membershipToBeUpdated.description = vm.edit.description;
      membershipToBeUpdated.$update(function(updateSuccess) {
        Notification.success('Membership is Updated Successfully of Bill Number ' + updateSuccess.billNumber);
        paginationForMembership(vm.serachMembership);
        vm.membershipEditer = false;
      }, function(errorDuringUpdate) {
        Notification.error(errorDuringUpdate);
      });
    };
    function paginationForMembership(serachMembership) {
      MembershipsService.query({ billNumber: serachMembership }, function(listOfMembership) {
        vm.memberships = listOfMembership;
        // console.log(vm.memberships);
      }, function(errorDuringPagination) {
        Notification.error(errorDuringPagination);
      });
    }
  }
}());
