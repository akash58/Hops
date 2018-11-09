(function () {
  'use strict';

  // Rentals service used for communicating with the rentals REST endpoint
  angular.module('bills').factory('BillGenerationFactory', ['$http', 'Bills', 'Rentals', 'FoodOrders', /* '$q', */function($http, Bills, Rentals, FoodOrders /* ,$q */) {


    // var foodorders =FoodOrders.query();
    // var rentals  = Rentals.query();
    /* var foodorders =rentals.then(function(){
  		// return foodorders='called';
  		return FoodOrders.query();
    }); */

    function getRentals(callback) {
      var rentals = Rentals.query(function() {
        if (callback) callback();
      });
      // return rentals;
      // return Rentals.query();
    }

    function getFoodOrders() {
      // var foodorders  = FoodOrders.query();
      return FoodOrders.query();
      // return Rentals.query();
    }

    function returnData() {
      /* getRentals(function(){
        //var foods=getFoodOrders();
        return getFoodOrders();
      }); */
      getRentals().then(function() {
        var foods = getFoodOrders();
        return foods;
      });
    }

    /* var returnData = getRentals().then(function(){
      var foods= getFoodOrders();
      return foods;
    }); */

    return {
      returnData: returnData
    };

  }]);
}());
