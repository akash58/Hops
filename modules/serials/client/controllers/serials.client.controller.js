'use strict';

angular.module('serials').controller('SerialsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Serials', 'Serialactivitys', 'filterFilter', 'SystemparametersService', 'TodaysDateWithoutMilliseconds', '$q', 'Products', 'SuppliersService',
  function($scope, $stateParams, $location, Authentication, Serials, Serialactivitys, filterFilter, SystemParameters, TodaysDateWithoutMilliseconds, $q, Products, Suppliers) {
    $scope.authentication = Authentication;
    /** ******************   used in search serials page      ***********************/

    $scope.selectLocation = function() {
      // $scope.test = 'selectLocation called';
      // document.getElementById('locationWarehouseupdate').select();
      // $scope.count = 0;
      // focus('locationWarehouseupdate');
      // $scope.$watch('activeSerial', function() {
   //         // do something here
   //         $scope.count += 1;
   //         // $window.document.getElementById(locationWarehouseupdate).focus();
   //       });
      // $scope.test = 'selectLocation finished';
    };

    $scope.updatePage = function() {
      Serials.get({ serialId: 'count', searchText: $scope.searchTextSerials.text }, function(serial_count) {
        $scope.totalItemsSerials = serial_count;
        if ($scope.searchTextSerials.text) $scope.curPageSerials.currentPages = 1;
        $scope.serialsDisplayed = Serials.query({ searchText: $scope.searchTextSerials.text, page: $scope.curPageSerials.currentPages, limit: $scope.limit }, function() {
          for (var i = 0; i < $scope.serialsDisplayed.length; i++) {
            $scope.serialsDisplayed[i].dateOfLastActivity = $scope.todaysDate();
            $scope.serialsDisplayed[i].locationWarehouse = $scope.serialsDisplayed[i].statusDetail.substring(24);
            $scope.serialsDisplayed[i].usedInForm = false;
          }

          $scope.indexStartSers.indexSt = ($scope.curPageSerials.currentPages - 1) * $scope.limit;
          $scope.indexEndSers.indexEd = Math.min(($scope.curPageSerials.currentPages) * $scope.limit, $scope.totalItemsSerials.count);

          $scope.clickSerial($scope.serialsDisplayed[0], function() {
            $scope.selectLocation();
          });
          // if (callback) callback();
          // $scope.indexStartSers = ($scope.curPageSerial.currentPage - 1) * $scope.limit ;
          // $scope.indexEndSers = Math.min( ($scope.curPageSerial.currentPage) * $scope.limit, $scope.totalItemsSerial.count) ;
        });
      });
    };

    /* $scope.shouldRenderForSearchSerials=function(){
        for (var p in $scope.pages)
          if ($scope.pages[p].pageName === 'Search Serials'){
            $scope.page = $scope.pages[p];
            break;
          }

        for (var i in $scope.authentication.user.roles) {
          for (var j in $scope.page.roles) {
            if ($scope.page.roles[j] === $scope.authentication.user.roles[i]) {
              return true;
            }
          }
        }

    return false;
    }; */


    $scope.initialize = function() {
      // pageAuthentication.shouldRender('Search Serials').then(function(res) {
        // $scope.test=res;
        // $scope.searchSerialsPageVisible = res;
      $scope.searchSerialsPageVisible = true;
      // });

      /* $scope.pages=Pages.query(function(){
        $scope.searchSerialsPageVisible = $scope.shouldRenderForSearchSerials();
      }); */

      SystemParameters.query({ systemParameterName: 'Currency Symbol' }, function(currencySymbol) {
        $scope.currencySymbol = currencySymbol[0].value;
      });

      /* SystemParameters.get({systemParameterName: 'Currency Symbol'},function(currencySymbol){
        $scope.currencySymbol = currencySymbol.value;
      }); */
      $scope.sellingSerial = '';
      $scope.junkingSerial = '';
      $scope.addSerialclicked = false;
      $scope.savedSerialSuccessfully = false;
      $scope.updatedSuccessfullySerial = false;
      $scope.errorSerial = false;
      $scope.errorSerialActivity = false;
      // $scope.ser = {'dateOfPurchase':$scope.todaysDate(), 'warrantyPeriod':12, acquisitionType:'Purchased',  dateOfWarrantyExpiry:$scope.oneYearLaterDate()};
      $scope.itemsPerPageHardCoded = 10; // hard coded in the current pagination
      $scope.curPageSerials = { currentPages: 1 };
      $scope.searchTextSerials = { text: '' };
      $scope.maxSize = 5;
      $scope.limit = 10;
      $scope.indexStartSers = { indexSt: '' };
      $scope.indexEndSers = { indexEd: '' };
      $scope.serialGame = { selectedItem: '', searchText: '' };
      $scope.serialSupplier = { selectedItem: '', searchText: '' };
      $scope.isDisabled = false;
      $scope.activeSerial = 0;
      // $scope.totalItemsSerial =
      $scope.serialsDisplayed = Serials.query({ page: 1, limit: 10 }, function() {
        $scope.clickSerial($scope.serialsDisplayed[0], function() {
          for (var i = 0; i < $scope.serialsDisplayed.length; i++) {
            $scope.serialsDisplayed[i].dateOfLastActivity = $scope.todaysDate();
            $scope.serialsDisplayed[i].locationWarehouse = $scope.serialsDisplayed[i].statusDetail.substring(24);
            $scope.serialsDisplayed[i].usedInForm = false;
          }
          $scope.selectLocation();
        });
        // if (callback) callback();
      });
      /* Serials.get({serialId:'count'},function(serial_count){
        $scope.totalItemsSerial = serial_count;
      }); */
      // $scope.updatePage();
    };

/** ***************** Save and Query functions reused multiple times  *************************/

    $scope.saveSerial = function(serial, callback, callback2) {
      serial.$save(function(response) {
        callback();
      }, function(errorResponse) {
        callback2(errorResponse);
      });
    };

    $scope.saveSerialActivity = function(serialactivity, callback, callback2) {
      serialactivity.$save(function(response) {
        callback();
      }, function(errorResponse) {
        callback2(errorResponse);
      });
    };

    $scope.updateSerial = function(serial, callback, callback2) {
      serial.$update(function(response) {
        callback();
      }, function(errorResponse) {
        callback2(errorResponse);
      });
    };

    $scope.querySerials = function(callback) {
      $scope.serials = Serials.query(function() {
        for (var i = 0; i < $scope.serials.length; i++) {
          $scope.serials[i].dateOfLastActivity = $scope.todaysDate();
          $scope.serials[i].locationWarehouse = $scope.serials[i].statusDetail.substring(24);
          $scope.serials[i].usedInForm = false;
        }
      });
      if (callback) callback();
    };

/** ************************************* Create Serial *********************************************/

    $scope.createSerial = function(callback) {
      // console.log($scope.serialSupplier);
      var statusDetail = ('Location in Warehouse : ' + this.ser.locationWarehouse);

      var serial = new Serials({
        product: $scope.serialGame.selectedItem._id,
        supplier: $scope.serialSupplier.selectedItem._id,
        serialNumber: this.ser.serialNumber,
        dateOfPurchase: this.ser.dateOfPurchase,
        warrantyPeriod: this.ser.warrantyPeriod,
        dateOfWarrantyExpiry: this.ser.dateOfWarrantyExpiry,
        dateOfLastActivity: this.ser.dateOfPurchase,
        purchasePrice: this.ser.price,
        depreciatedValue: this.ser.price,
        residualValue: this.ser.price,
        acquisitionType: this.ser.acquisitionType,
        manufacturerSerialNumber: this.ser.manufacturerSerialNumber,
        description: this.ser.description,
        statusDetail: statusDetail,
        status: 'In Stock'
      });

      $scope.saveSerial(serial, function() {
        $scope.querySerials(function() {
          $scope.createSerialActivity(serial);
          if (callback) callback();
        });
      },
      function(errorResponse) {
        $scope.errorSerial = errorResponse.data.message;
      });
    };

    $scope.querySerialGame = function(query) {
      var deferred = $q.defer();
      Products.query({ productNumber: query }, function(res) { /* console.log(res); */
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.querySerialSupplier = function(query) {
      var deferred = $q.defer();
      Suppliers.query({ companyName: query }, function(res) {
        // console.log(res);
        deferred.resolve(res);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $scope.createSerialActivity = function(serial) {
      var serialactivity = new Serialactivitys({
        serial: serial._id,
        // system : '',
        dateOfActivity: serial.dateOfPurchase,
        depreciatedValue: serial.depreciatedValue,
        residualValue: serial.residualValue,
        status: serial.status,
        statusDetail: serial.statusDetail,
        description: serial.description
      });
      $scope.saveSerialActivity(serialactivity, function() {
        $scope.savedSerialSuccessfully = true;
        $scope.clearSerial();
      },
      function(errorResponse) {
        $scope.errorSerial = 'Please take screenshot and report this issue: Serial saved successfully but Serial Activity failed due to : ' + errorResponse.data.message;
      });
    };

/** ************************************ Update Serial ****************************************/

    $scope.UpdateSerials = function(serial) {
      var dateWithoutSeconds = TodaysDateWithoutMilliseconds;
      // $scope.testingDate = $scope.todaysDate();
      var statusDetail = ('Location in Warehouse : ' + serial.locationWarehouse);
      if (serial.locationWarehouse === '')
        $scope.errorUpdateSerial = 'Please Add Location In Warehouse To Update Serial.';
      else {
        var sendSerial = new Serials({
          _id: serial._id,
          depreciatedValue: serial.depreciatedValue,
          residualValue: serial.residualValue,
          description: serial.description,
          statusDetail: statusDetail,
          dateOfLastActivity: dateWithoutSeconds // new Date()
        });

        $scope.updateSerial(sendSerial, function() {
          $scope.querySerials(function() {
            $scope.updateSerialActivitys(sendSerial);
            $scope.updatedSuccessfullySerial = true;
            $scope.errorUpdateSerial = '';
            // focus('searchTextSerials');
          });
        }, function(errorResponse) {
          $scope.errorUpdateSerial = errorResponse.data.message;
          $scope.updatedSuccessfullySerial = '';
        });
      }
    };

    $scope.updateSerialActivitys = function(serial) {
      var serialactivity = new Serialactivitys({
        serial: serial._id,
        // system: '',
        dateOfActivity: serial.dateOfLastActivity,
        depreciatedValue: serial.depreciatedValue,
        residualValue: serial.residualValue,
        status: serial.status,
        statusDetail: serial.statusDetail,
        description: serial.description
      });

      $scope.saveSerialActivity(serialactivity, function() {
        $scope.updatedSuccessfullySerial = true;
        $scope.errorSerialActivity = '';
      }, function(errorResponse) {
        $scope.errorSerialActivity = errorResponse.data.message;
      });
    };

/** ***************************** Sell Serials Related *************************************/

    $scope.sellSerial = function(serial, callback) {
      var dateWithoutSeconds = TodaysDateWithoutMilliseconds;
      var soldTo = ('Sold To: ' + $scope.sellSerialValue.soldTo);
      // if (true/* serial.soldTo === '' */)
      if ($scope.sellSerialValue.soldTo === '')
        $scope.errorUpdateSerial = 'Please Add Name Whom To Sold.';
      else {
        var sendSerial = new Serials({
          _id: serial._id,
          depreciatedValue: serial.depreciatedValue,
          residualValue: serial.residualValue,
          description: serial.description,
          statusDetail: soldTo,
          dateOfLastActivity: dateWithoutSeconds, // new Date(), // serial.dateOfLastActivity,
          status: 'Sold'
        });

        $scope.updateSerial(sendSerial, function() {
          $scope.serialsOnPage.splice($scope.serialsOnPage.indexOf(serial), 1);
          // $scope.serialsDisplayed.splice($scope.serialsDisplayed.indexOf(serial), 1);
          $scope.querySerials(function() {
            $scope.sellSerialActivitys(sendSerial, soldTo);
          });
          $scope.updatedSuccessfullySerial = true;
          $scope.errorUpdateSerial = '';
        }, function(errorResponse) {
          $scope.errorUpdateSerial = errorResponse.data.message;
          $scope.updatedSuccessfullySerial = '';
        });

        // if (callback && $scope.updatedSuccessfullySerial === true) callback();
        $scope.updatePage();
        if (callback && $scope.updatedSuccessfullySerial === true) callback();
      }
    };

    $scope.sellSerialActivitys = function(sendSerial, soldTo) {
      var serialactivity = new Serialactivitys({
        serial: sendSerial._id,
        // system : '',
        dateOfActivity: sendSerial.dateOfLastActivity,
        depreciatedValue: sendSerial.depreciatedValue,
        residualValue: sendSerial.residualValue,
        status: 'Sold',
        statusDetail: soldTo,
        description: sendSerial.description
      });

      $scope.saveSerialActivity(serialactivity, function() {
        $scope.updatedSuccessfullySerial = true;
        $scope.clearSerial();
        // var searchTextPass='';
        // $scope.pageChangedSerial(sendSerial.product);
      },
      function(errorResponse) {
        $scope.errorUpdateSerial = 'Please take screenshot and report this issue: Serial updated successfully but Serial Activity failed due to : ' + errorResponse.data.message;
      });
    };

/** ******************************* Junk Serial Related *****************************************/

    $scope.junkSerial = function(serial, callback) {
      var dateWithoutSeconds = TodaysDateWithoutMilliseconds;
      var junkTo = ('Junked To: ' + $scope.junkSerialValue.junkTo);
      // $scope.juckSerialValue.junkTo = ;
      // if (true)
      if ($scope.junkSerialValue.junkTo === '') {
        $scope.errorUpdateSerial = 'Please Add Name Whom To Junk.';
      } else {
        var sendSerial = new Serials({
          _id: serial._id,
          depreciatedValue: 0,
          residualValue: serial.residualValue,
          description: serial.description,
          statusDetail: junkTo,
          dateOfLastActivity: dateWithoutSeconds, // serial.dateOfLastActivity,
          status: 'Junked'
        });

        $scope.updateSerial(sendSerial, function() {
          $scope.serialsOnPage.splice($scope.serialsOnPage.indexOf(serial), 1);
          // $scope.serialsDisplayed.splice($scope.serialsDisplayed.indexOf(serial), 1);
          $scope.querySerials(function() {
            // $scope.pageChangedSerial();
            $scope.junkSerialActivity(sendSerial, junkTo);
          });
          $scope.updatedSuccessfullySerial = true;
          $scope.errorUpdateSerial = '';
        },
        function(errorResponse) {
          $scope.errorUpdateSerial = errorResponse.data.message;
          $scope.updatedSuccessfullySerial = '';
        });
        $scope.updatePage();
        // callback();
        if (callback && $scope.updatedSuccessfullySerial === true) callback();
      }
    };

    $scope.junkSerialActivity = function(sendSerial, junkTo) {
      var serialactivity = new Serialactivitys({
        serial: sendSerial._id,
        // system: '',
        dateOfActivity: sendSerial.dateOfLastActivity,
        depreciatedValue: sendSerial.depreciatedValue,
        residualValue: sendSerial.residualValue,
        status: 'Junked',
        statusDetail: junkTo,
        description: sendSerial.description
      });

      $scope.saveSerialActivity(serialactivity, function() {
        $scope.updatedSuccessfullySerial = true;
        $scope.clearSerial();
        // var searchTextPass='';
        // $scope.pageChangedSerial(sendSerial.product,searchTextPass);
      }, function(errorResponse) {
        $scope.errorUpdateSerial = 'Please take screenshot and report this issue: Serial updated successfully but Serial Activity failed due to : ' + errorResponse.data.message;
      });
    };

/** ***************************** Date Related Functions ********************************************/

    $scope.todaysDate = function() {
      var date = new Date();

      /* var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      if (month<10) month = '0' + month;
      if (day<10) day = '0' + day;

      var today = year + '-' + month + '-' + day; */
      return date;
    };

    /* $scope.dropmilliseconds = function(){
      var date = new Date();

      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var seconds = date.getSeconds();

      if (month<10) month = '0' + month;
      if (day<10) day = '0' + day;

      //var today = year + '-' + month + '-' + day;
      var today = new Date(year,month,day,hour,minute,seconds);
      return today;
    }; */

    $scope.oneYearLaterDate = function() {
      var date = new Date();

      date.setMonth(date.getMonth() + 12);

      // var day = date.getDate();
      // var month = date.getMonth() + 1;
      // var year = date.getFullYear();

      // if (month<10) month = '0' + month;
      // if (day<10) day = '0' + day;

      // var oneYearLaterDate = year + '-' + month + '-' + day;
      return date;
    };

    $scope.updateWarrantyExpiry = function() {
      var dateofPurchaseEntered = this.ser.dateOfPurchase;
      var warrantyPeriodEntered = this.ser.warrantyPeriod;
      // var n = dateofPurchaseEntered.toString();
          // console.log(n);
          // console.log(typeof(n));
      /* var day = n.substring(8,10);
      var month = n.substring(4,7);
      var year = n.substring(0,4); */

          // console.log(day);
          // console.log(month);
          // console.log(year);
      var date = new Date(dateofPurchaseEntered);
        /* console.log(date);
        console.log(typeof(date)); */
      date.setMonth(date.getMonth() + warrantyPeriodEntered);

      /* day = date.getDate();
          console.log(day);
      month = date.getMonth() + 1;
      year = date.getFullYear();

      if (month<10) month = '0' + month;
      if (day<10) day = '0' + day;

      var dateOfWarrantyExpiryToBeSet = year + '-' + month + '-' + day; */

      $scope.ser.dateOfWarrantyExpiry = date;
    };

    $scope.updateWarrantyPeriod = function() {
      var dateOfWarrantyExpiryEntered = new Date(this.ser.dateOfWarrantyExpiry);
      // console.log(dateOfWarrantyExpiryEntered);
      // var day = dateOfWarrantyExpiryEntered.substring(8,10);
          // console.log(day);
      // var month = dateOfWarrantyExpiryEntered.substring(5,7) - 1;
      // var year = dateOfWarrantyExpiryEntered.substring(0,4);

      // var day1 = this.ser.dateOfPurchase.substring(8,10);
      // var month1 = this.ser.dateOfPurchase.substring(5,7) - 1;
      // var year1 = this.ser.dateOfPurchase.substring(0,4);

      // var yearDiff  = Number(year) - Number(year1);
      // var monthDiff  = Number(month) - Number(month1);
      // var dayDiff  = Number(day) - Number(day1);
      var day = dateOfWarrantyExpiryEntered.getDate();
      var month = dateOfWarrantyExpiryEntered.getMonth() + 1;
      var year = dateOfWarrantyExpiryEntered.getFullYear();

      var dateOfPurchase = new Date(this.ser.dateOfPurchase);
      var day1 = dateOfPurchase.getDate();
      var month1 = dateOfPurchase.getMonth();
      var year1 = dateOfPurchase.getFullYear();

      var yearDiff = Number(year) - Number(year1);
      var monthDiff = Number(month) - Number(month1);
      var dayDiff = Number(day) - Number(day1);

      var warrantyPeriodToBeSet = Math.round(yearDiff * 12 + monthDiff + dayDiff * (1 / 30));
      $scope.ser.warrantyPeriod = warrantyPeriodToBeSet;
    };

    $scope.stringifyDate = function(dateFromDB) {
      var dateNeeded = dateFromDB;

      var day = dateNeeded.substring(8, 10);
      var month = dateNeeded.substring(5, 7);
      var year = dateNeeded.substring(0, 4);

      // if (month<10) month = '0' + month;

      var dateString = year + '-' + month + '-' + day;

      return dateString;
    };

/** ************************ Basic Functions ****************************************/

    $scope.find = function() {
      /* $scope.pages=Pages.query(function(){
        $scope.pageVisible = $scope.shouldRender();
      }); */
      $scope.serialGame = { selectedItem: '', searchText: '' };
      $scope.serialSupplier = { selectedItem: '', searchText: '' };
      // pageAuthentication.shouldRender('Serials').then(function(res) {
        // $scope.test=res;
      $scope.pageVisible = true;
        // $scope.pageVisible = res;
      // });
      $scope.systemparameters = SystemParameters.query(function() {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
      });
      $scope.querySerials(function() {
        $scope.addSerialclicked = false;
        $scope.savedSerialSuccessfully = false;
        $scope.updatedSuccessfullySerial = false;
        $scope.errorSerial = false;
        $scope.ser = { 'dateOfPurchase': $scope.todaysDate(), 'warrantyPeriod': 12, acquisitionType: 'Purchased', dateOfWarrantyExpiry: $scope.oneYearLaterDate() };
        $scope.itemsPerPageHardCoded = 10; // hard coded in the current pagination
        $scope.curPageSerial = { currentPage: 1 };
        $scope.searchTextSerial = { text: '' };
        $scope.maxSize = 5;
        // $scope.pageChangedSerial(product,$scope.searchTextSerial.txt);
      });
    };

    $scope.findOne = function() {
      $scope.serial = Serials.get({
        serialId: $stateParams.serialId
      });
    };

    /* $scope.queryPages = function() {
      $scope.pages=Pages.query(function(){
        $scope.pageVisible = $scope.shouldRender();      });
    }; */

    $scope.focusSerial = function() {
      $scope.errorSerial = false;
      $scope.errorUpdateSerial = false;
      $scope.savedSerialSuccessfully = false;
      $scope.updatedSuccessfullySerial = false;
    };

    $scope.addSerialbuttonclicked = function() {
      $scope.addSerialclicked = !$scope.addSerialclicked;
      $scope.savedSerialSuccessfully = false;
      $scope.errorSerial = false;
    };

    $scope.serDateInit = function() {
      $scope.ser = '';
      $scope.ser = { dateOfPurchase: new Date(), warrantyPeriod: 12, acquisitionType: 'Purchased', dateOfWarrantyExpiry: $scope.oneYearLaterDate() };
    };

    $scope.clearSerial = function() {
      $scope.ser = '';
      $scope.ser = { 'dateOfPurchase': $scope.todaysDate(), 'warrantyPeriod': 12, acquisitionType: 'Purchased', dateOfWarrantyExpiry: $scope.oneYearLaterDate() };
    };

    $scope.sellSerialClicked = function(serial) {
      // $scope.activeSerial = '';
      $scope.sellingSerial = serial.serialNumber;
      $scope.junkingSerial = '';
      $scope.sellSerialValue = { soldTo: '', dateOfSold: serial.dateOfLastActivity, depreciatedValue: serial.depreciatedValue, description: '' };
      // $scope.sellSeri = { soldTo: '', dateOfSold: serial.dateOfLastActivity, depreciatedValue: serial.depreciatedValue, description: '' };
    };

    $scope.junkSerialClicked = function(serial) {
      // $scope.activeSerial = '';
      $scope.junkingSerial = serial.serialNumber;
      $scope.sellingSerial = '';
      $scope.junkSerialValue = { junkTo: '', dateOfJuck: serial.dateOfLastActivity, description: '' };
    };

    $scope.goBack = function() {
      $scope.junkingSerial = '';
      $scope.sellingSerial = '';
    };

/** ************************** Click Active Serial  **************************************/

    $scope.clickSerial = function(serial, callback) {
      // console.log(serial.serialNumber);
      if ($scope.activeSerial === serial.serialNumber)
        $scope.activeSerial = '';
      else {
        $scope.activeSerial = serial.serialNumber;

        // $scope.dateofPurchaseString = $scope.stringifyDate(serial.dateOfPurchase);
        // $scope.dateofExpString = $scope.stringifyDate(serial.dateOfWarrantyExpiry);
        $scope.dateofPurchaseString = new Date(serial.dateOfPurchase);
        $scope.dateofExpString = new Date(serial.dateOfWarrantyExpiry);

        if (callback) callback();
        // $scope.selectLocation();
      }
    };
/** ********************************* User Role coding  ****************************************/

    /* $scope.shouldRender=function(){

        for (var p in $scope.pages)
          if ($scope.pages[p].pageName === 'Serials'){
            $scope.page = $scope.pages[p];
            break;
          }

        for (var i in $scope.authentication.user.roles) {
          for (var j in $scope.page.roles) {
            if ($scope.page.roles[j] === $scope.authentication.user.roles[i]) {
              return true;
            }
          }
        }

    return false;
    }; */
/** ********************** Functions used in Systems Page **********************************************/

    /* $scope.updateRow = function (selectedSerial) {
      for (var i=0; i< $scope.serials.length; i++)
        if ($scope.serials[i]._id === selectedSerial) {

          var componentrow = {selectedComponent : '', selectedProduct: '', selectedSerial: '', purchasePrice: '', depreciatedValue: '',residualValue: ''};
          componentrow.selectedComponent = $scope.serials[i].product.component;
          componentrow.selectedProduct = $scope.serials[i].product._id;
          componentrow.selectedSerial = selectedSerial;
          componentrow.purchasePrice = $scope.serials[i].purchasePrice;
          componentrow.depreciatedValue = $scope.serials[i].depreciatedValue;
          componentrow.residualValue = $scope.serials[i].residualValue;
          return componentrow;
        }
    };

    $scope.updateSystemTypeRow = function (systemtypecomponent) {
      for (var i=0; i< $scope.serials.length; i++)
        if ($scope.serials[i]._id === systemtypecomponent.selectedSerial._id) {
          systemtypecomponent.selectedProduct = $scope.serial[i].product._id;
          systemtypecomponent.purchasePrice = $scope.serial[i].purchasePrice;
          systemtypecomponent.depreciatedValue = $scope.serial[i].depreciatedValue;
          systemtypecomponent.residualValue = $scope.serial[i].residualValue;
          return systemtypecomponent;
        }

    };*/

    /* $scope.updateUsedInForm = function(systemtypecomponents,componentrows,selectedSerial){

      var reusedSerial = false;

      // $scope.test = {test1 : row};
      // if (row.selectedSerial === null)
      //  return reusedSerial;

      // return true if selectedSerial is already used in Form
      for (var a=0; a < $scope.serials.length; a++)
        if ($scope.serials[a]._id === selectedSerial )
          if ($scope.serials[a].usedInForm === true)
            reusedSerial = true;

      // clear all the serials used in form
      for(var i = 0; i < $scope.serials.length;i++)
        $scope.serials[i].usedInForm = false;#

      // for all serials selected in systemtypecomponents set the used in form equal to true
      for(var j = 0; j < systemtypecomponents.length; j++)
        for( i = 0; i < $scope.serials.length; i++)
          if(systemtypecomponents[j].selectedSerial._id === $scope.serials[i]._id)
            $scope.serials[i].usedInForm = true;

      // for all serials selected in componentrows set the used in form equal to true
      for(var k = 0; k < componentrows.length; k++)
        for(i = 0; i < $scope.serials.length; i++)
          if(componentrows[k].selectedSerial._id === $scope.serials[i]._id)
            $scope.serials[i].usedInForm = true;
      // $scope.test = {test1 : row.selectedSerial};

      // return reusedSerial to the form variable
      return reusedSerial;
    };*/

/** **********************************************pagination*******************************************************/

    $scope.pageChangedSerial = function(product, searchText) {

      $scope.serialsInProduct = filterFilter($scope.serials, { product: { _id: product }, status: 'In Stock' });
      // $scope.serialsInProduct=[];
      // for(var a=0;a<$scope.serials.length;a++){
      //  if($scope.serials[a].product._id === product){
      // $scope.serialsInProduct.push($scope.serials[a]);
      // }
      // }

      $scope.serialsWithSearchNumber = filterFilter($scope.serialsInProduct, { serialNumber: searchText });
      $scope.totalItemsSerial = $scope.serialsWithSearchNumber.length;
      $scope.serialsOnPage = [];
      $scope.indexStartSer = ($scope.curPageSerial.currentPage - 1) * $scope.itemsPerPageHardCoded;
      $scope.indexEndSer = Math.min(($scope.curPageSerial.currentPage) * $scope.itemsPerPageHardCoded, $scope.serialsWithSearchNumber.length);

      for (var i = (($scope.curPageSerial.currentPage - 1) * $scope.itemsPerPageHardCoded); i < Math.min(($scope.curPageSerial.currentPage) * $scope.itemsPerPageHardCoded, $scope.serialsWithSearchNumber.length); i++) {
        $scope.serialsOnPage.push($scope.serialsWithSearchNumber[i]);
      }
    };

    /* $scope.pageChangedSerialAll = function(searchText){
      $scope.getSerialCount = Serials.get({serialId : 'count', serialNumber : searchText},function(){
        $scope.totalItemsSerial = $scope.getSerialCount;
      });
      //$scope.test4 ='WorK';
      $scope.serialsOnPage = Serials.query({page : $scope.curPageSerial.page,  limit: $scope.limit, serialNumber: searchText},function(){
        $scope.indexStartSer = ($scope.curPageSerial.page - 1) * $scope.limit ;
        $scope.indexEndSer = Math.min( ($scope.curPageSerial.page) * $scope.limit, $scope.totalItemsSerial.count) ;
      });
    }; */
  }
]);
