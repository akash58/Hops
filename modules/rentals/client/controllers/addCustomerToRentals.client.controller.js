(function () {
  'use strict';

  angular
    .module('rentals')
    .controller('AddCustomerTORentalController', AddCustomerTORentalController);

  AddCustomerTORentalController.$inject = ['$scope', /* 'tableResolve', */ 'Authentication', 'TablesService', '$mdDialog', '$mdToast', 'CustomersService', '$q', 'RentalsService', 'passObj', 'PackagesService', 'PackageorderService', '$window', 'foodOnly', 'MembershipactivitiesService', 'MembershipsService'];

  function AddCustomerTORentalController($scope, /* tableResolve, */ Authentication, TablesService, $mdDialog, $mdToast, CustomersService, $q, RentalsService, passObj, PackagesService, PackageorderService, $window, foodOnly, MembershipactivitiesService, MembershipsService) {
    var vm = this;
    vm.authentication = Authentication;
    $scope.deposit = '';
    $scope.foodOnly = foodOnly;
    var dateFormat = new Date();
    /* *************************
    *
    */
    // vm.tables = TablesService.query();
    if (!$scope.foodOnly) {
      dateFormat.setHours(1);
      dateFormat.setMinutes(0);
      dateFormat.setSeconds(0);
      dateFormat.setMilliseconds(0);
    } else {
      dateFormat.setHours(0);
      dateFormat.setMinutes(0);
      dateFormat.setSeconds(0);
      dateFormat.setMilliseconds(0);
    }
    $scope.packages = PackagesService.query();
    $scope.customers = CustomersService.query();
    $scope.rentals = RentalsService.query();
    // $scope.rentalsToBeBilled = rentalsToBeBilled;

    $scope.customerToBeAdded = {
      customerID: '',
      customerSelectedItem: '',
      customerSearchText: '',
      selectedPackage: '',
      packageSearchText: '',
      expectedRentalTime: dateFormat,
      description: ''
    };

    $scope.queryRental = function(callback) {
      $scope.rentals = RentalsService.query(function() {

      });
    };

    $scope.queryCustomer = function(searchText) {
      var deferred = $q.defer();
      CustomersService.query({ searchText: searchText }, function(res) {
        // $scope.checkIfCustomersAreMembers();
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.queryPackage = function(searchText) {
      var deferred = $q.defer();
      PackagesService.query({ searchText: searchText }, function(res) {
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.selectedCustomerItemChange = function(item) {
      if (item) {
        $scope.customerToBeAdded.customerID = item.customerId;
      }
    };

/** **************************function to find if membership exists ***********************/
    // $scope.checkIfCustomersAreMembers=function(callback){

    //   var promises=[];
    //   for(var i=0;i<$scope.rentals.length;i++){
    //     //$scope.test=$scope.rent.table;
    //     if($scope.rentals[i].table._id === $scope.rent.table && $scope.rentals[i].activeRental === true){
    //       promises.push($scope.isCustomerMember(i));
    //     }
    //   }
    //   var allPromise = $q.all(promises);
    //   allPromise.then( function(){
    //     if(callback) callback();
    //   });
    // };

    // $scope.isCustomerMember = function(i) {
    //   var defer = $q.defer();

    //   $scope.checkIfCustomerIsMember($scope.rentalsToBeBilled[i], i, function(returnedResult) {

    //     $scope.rentalsToBeBilled[i].isMember = returnedResult;
    //     defer.resolve();

    //   });
    //   return defer.promise;
    // };

    $scope.checkIfCustomerIsMember = function(rental, i, callback) {

      var returnResult = false;
      var deferred = $q.defer();
      var membership = MembershipsService.get({ customer: rental.customer._id }, function() {

        if (membership && Object.keys(membership).length > 2) {
          var startDate = new Date(membership.membershipStartDate);
          var endMembershipDate = new Date(membership.membershipExpiry);

          if (startDate <= $scope.date && $scope.date <= endMembershipDate) {
            returnResult = true;
            deferred.resolve();
          } else {
            $scope.membershipDateActCheck(membership, function(result) {
            //  //$scope.rentalsToBeBilled[i].isMember = result;

              returnResult = result;
              deferred.resolve();
            });
          }
        } else {
          returnResult = false;
          deferred.resolve();

        }
      });

      deferred.promise.then(function() {
        if (callback) callback(returnResult);
      });
    };

    $scope.membershipDateActCheck = function(membership, callback) {
      console.log('membership date check CALLEd');
      var result = false;
      var membershipActivitiesTemp = MembershipactivitiesService.query({ customerID: membership.customer._id }, function() {
        for (var i = 0; i < membershipActivitiesTemp.length; i++) {
          var startDate = new Date(membershipActivitiesTemp[i].membershipStartDate);
          var endDate = new Date(membershipActivitiesTemp[i].membershipExpiry);
          // var todaysDate = new Date();
          if ($scope.date >= startDate && $scope.date <= endDate) {
            result = true;

            break;
          }
        }
        if (callback) callback(result);
      });
    };


/**
    This function is get called on the ng-change of the customer id text box
    to check if the customer id enter in the text box holds the membership.
**/
    $scope.toCheckIfCustomerHasMembershipOnCustID = function(custId) {
      for (var a = 0; a < $scope.customers.length; a++) {
        if ($scope.customers[a].customerId === custId) {
          $scope.toCheckIfCustomerHasMembership($scope.customers[a]._id);
        }
      }
    };
/** ******************************To Check If Customer Has Membership Function ************************/

    $scope.toCheckIfCustomerHasMembership = function(customer) {
      // $scope.testing=customer;

      MembershipsService.get({ customer: customer }, function(membership) {
        console.log('WORK');
        if (membership && Object.keys(membership).length > 2) {
          // && membership!=='{}'
          // var startDate=$scope.getDateFunction(membership.membershipStartDate);
          var startDate = new Date(membership.membershipStartDate);
          // $scope.testing=startDate;
          // var endMembershipDate=$scope.getDateFunction(membership.membershipExpiry);
          var endMembershipDate = new Date(membership.membershipExpiry);
          // var todaysDate=Date.now();
          var todaysDate = new Date();
          // $scope.testing=startDate;
          // $scope.end=endMembershipDate;
          // $scope.today=new Date();

          if (startDate < todaysDate && todaysDate < endMembershipDate) {
            $scope.customerSelectedIsMember = true;
            $scope.rent.package = '';

          } else {
            // $scope.customerSelectedIsMember=false;
            $scope.membershipDateActCheck(membership, function(result) {
              $scope.customerSelectedIsMember = result;

            });

          }
        } else {
          // $scope.testing='called';
          $scope.customerSelectedIsMember = false;

        }
      });

    };

    $scope.membershipDateActCheck = function(membership, callback) {
      var result = false;
       // var customerids = $scope.customerIDs;
      // $scope.testGet = Membershipactivities.get({searchText : customerids});
      var membershipActivitiesTemp = MembershipactivitiesService.query({ customerID: membership.customer._id }, function() {
        for (var i = 0; i < membershipActivitiesTemp.length; i++) {
          // var startDate=$scope.getDateFunction(membershipActivitiesTemp[i].membershipStartDate);
          // var endDate=$scope.getDateFunction(membershipActivitiesTemp[i].membershipExpiry);
          var startDate = new Date(membershipActivitiesTemp[i].membershipStartDate);
          var endDate = new Date(membershipActivitiesTemp[i].membershipExpiry);
          var todaysDate = new Date();
          if (todaysDate >= startDate && todaysDate <= endDate) {
            result = true;
            $scope.rent.package = '';
            break;
          }
        }
        if (callback) callback(result);
      });

    };

    /** ************* to get hours based on the package selected  ****************/
    $scope.getExpectedtimeforPackage = function(sendpackages) {
      console.log(sendpackages);
      console.log($scope.packages);

      for (var i = 0; i < $scope.packages.length; i++)
        if ($scope.packages[i]._id === sendpackages._id) {
          $scope.customerToBeAdded.expectedRentalTime = new Date(sendpackages.hours);
        }
    };

    $scope.calculatedEndTime = function(expectedTime) {
      if (!expectedTime || expectedTime === '' || expectedTime === '00:00')
        $scope.errorRental = 'Please estimate Expected Rental Time before starting rental. Use Game Data to estimate if needed.';
      else {
        // var expectedHours = Number(expectedTime.substring(0,2));
        // var expectedMins = Number(expectedTime.substring(3,5));
        var time = new Date(expectedTime);
        var expectedHours = time.getHours();
        var expectedMins = time.getMinutes();
        return new Date(Date.now() + expectedHours * 3600000 + expectedMins * 60000);
      }
    };

    /** ************************************ function to Append Customer ******************************** **/
    $scope.appendCustomers = function(callback) {

      for (var k = 0; k < $scope.customers.length; k++) {
        $scope.customers[k].alreadyRenting = false;

        for (var j = 0; j < $scope.rentals.length; j++) {
          for (var i = 0; i < $scope.customers.length; i++) {

            if ($scope.customers[i]._id === $scope.rentals[j].customer._id) {

              $scope.customers[i].alreadyRenting = true;
              break;
            }
          }
        }
      }
      if (callback) callback();

    };

    $scope.checkIfCustomerAlreadyRenting = function(customerid) {
      $scope.queryRental(function() {
        $scope.appendCustomers(function() {
          for (var l = 0; l < $scope.customers.length; l++) {
            if ($scope.customers[l]._id === customerid) {
              if ($scope.customers[l].alreadyRenting === true) {
                $window.alert('Customer already renting!');
                $scope.queryCustomer();
              } else {
                $scope.addCustomer();
              }
              break;
            }
          }
        });
      });
    };

    $scope.addCustomer = function() {

      var rental = new RentalsService({
        table: passObj.table,
        customer: $scope.customerToBeAdded.customerSelectedItem._id,
        attendant: passObj.attendant,
        description: $scope.customerToBeAdded.description,
        foodOnly: passObj.foodOnly,
        deposit: $scope.deposit
      });
      if (!$scope.foodOnly) {
        rental.serial = passObj.serial;
        rental.rentalStart = Date.now();
        rental.renewalRentalStart = Date.now();
        rental.rentalEnd = $scope.calculatedEndTime($scope.customerToBeAdded.expectedRentalTime);
      }
      console.log(rental);
      rental.$save(function(response) {
        // var customerNrentalObj = {
        //   rental: rental,
        //   populatedCustomer: $scope.customerSelectedItem
        // };
        if ($scope.customerToBeAdded.selectedPackage) {
          $scope.passPackageOrder(rental);
        }
        rental.customer = $scope.customerToBeAdded.customerSelectedItem;
        $mdDialog.hide(rental);
      }, function(err) {
        $scope.error = err;
      });
    };

    $scope.passPackageOrder = function(rental) {

      var sendPackageOrder = new PackageorderService({
        package: $scope.customerToBeAdded.selectedPackage,
        rental: rental._id,
        created: Date.now(),
        customer: rental.customer
      });

      sendPackageOrder.$save(function() {
        $scope.savedpackageOrderSuccessfully = true;
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
}());
