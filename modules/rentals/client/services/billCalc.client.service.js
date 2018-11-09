'use strict';

// Rentals service used for communicating with the rentals REST endpoint
angular.module('rentals').factory('billCalcService', function() {

/* ************************* get food order for the rental *************************** */
  function getFoodOrders (rentalForCalculation, foodorders, rentals, chargeMultiplierWithFood, isWeekend, weekendMemberShipdiscount, weekdayMemberShipdiscount, serviceCharge, vat, serviceTaxRateWithFood, foodCgst, foodSgst, gameCgst, gameSgst) {
      // console.log(foodorders[0]);
    var i = 0;
    var j = 0;
    var foodOrderTemp;
    var currentRental = rentalForCalculation;
    var foodOrdersForRentals = [];
    var foodRevenueSubTotal = 0;
    rentalForCalculation.foodRevenue = 0;
    rentalForCalculation.serviceChargeOnFood = 0;
    rentalForCalculation.cgstOnFood = 0;
    rentalForCalculation.sgstOnFood = 0;
    rentalForCalculation.totalOnFood = 0;

    while (currentRental) {
      for (i = 0; i < foodorders.length; i++) {
        if (foodorders[i].rental) {
          if (foodorders[i].rental._id === currentRental._id) {
            foodOrderTemp = angular.copy(foodorders[i]);
            foodOrderTemp.billPrice = parseFloat(Math.round(foodorders[i].food.price * chargeMultiplierWithFood * 100) / 100).toFixed(2);
            foodOrderTemp.billCharge = parseFloat(Number(foodOrderTemp.billPrice) * foodOrderTemp.quantity).toFixed(2);
            foodRevenueSubTotal = foodRevenueSubTotal + Number(foodOrderTemp.billCharge);
            foodOrdersForRentals.push(foodOrderTemp);
          }
        }
        // else { log that foodorders need to be cleaned up}
      }
      if (currentRental.renewalRental) {
        for (j = 0; j < rentals.length; j++) {
          if (rentals[j]._id === currentRental.renewalRental) {
            currentRental = rentals[j];
            break;
          }
        }
      } else currentRental = null;
    }

    var summarizedFoodOrdersForRentals = [];
    var summarizedFoodIdForRentals = [];
    var tempIndex;
    var tempFoodOrderId;
    var tempFoodOrder;

    for (i = 0; i < foodOrdersForRentals.length; i++) {
      if (summarizedFoodIdForRentals.indexOf(foodOrdersForRentals[i].food._id) < 0) {
        foodOrdersForRentals[i].quantityCharged = foodOrdersForRentals[i].quantity;
        summarizedFoodIdForRentals.push(foodOrdersForRentals[i].food._id);
        summarizedFoodOrdersForRentals.push(foodOrdersForRentals[i]);
      } else {
        tempIndex = summarizedFoodIdForRentals.indexOf(foodOrdersForRentals[i].food._id);
        tempFoodOrderId = summarizedFoodIdForRentals.splice(tempIndex, 1).pop();
        tempFoodOrder = summarizedFoodOrdersForRentals.splice(tempIndex, 1).pop();
        tempFoodOrder.quantityCharged = Number(tempFoodOrder.quantity) + Number(foodOrdersForRentals[i].quantity);
        tempFoodOrder.quantity = Number(tempFoodOrder.quantity) + Number(foodOrdersForRentals[i].quantity);
        tempFoodOrder.billCharge = parseFloat(Number(tempFoodOrder.billPrice) * tempFoodOrder.quantityCharged).toFixed(2);

        summarizedFoodIdForRentals.push(tempFoodOrder.food._id);

        summarizedFoodOrdersForRentals.push(tempFoodOrder);
      }
    }

    rentalForCalculation.foodorders = summarizedFoodOrdersForRentals;

    rentalForCalculation.foodRevenueConversion = parseFloat(Math.round(Number(foodRevenueSubTotal) * 100) / 100).toFixed(2);

    rentalForCalculation.membershipDiscountOnFood = (rentalForCalculation.isMember === true ? parseFloat(Math.round((Number(rentalForCalculation.foodRevenueConversion * (isWeekend === 'Y' ? weekendMemberShipdiscount : weekdayMemberShipdiscount) / 100)) * 100) / 100).toFixed(2) : 0);


    // change from below due to eslint error saying no-nested-ternary

    if (rentalForCalculation.isMember)
      if (isWeekend === 'Y') rentalForCalculation.membershipDiscountPercentage = weekendMemberShipdiscount;
      else rentalForCalculation.membershipDiscountPercentage = weekdayMemberShipdiscount;
    else rentalForCalculation.membershipDiscountPercentage = 0;

    rentalForCalculation.foodRevenue = (Number(rentalForCalculation.foodRevenueConversion) - Number(rentalForCalculation.membershipDiscountOnFood)).toFixed(2);

    // rentalForCalculation.test=(Number(rentalForCalculation.foodRevenueConversion) - Number(rentalForCalculation.membershipDiscountOnFood)).toFixed(2);

    rentalForCalculation.serviceChargeOnFood = parseFloat(Math.round(Number(foodRevenueSubTotal) * serviceCharge) / 100).toFixed(2);
    rentalForCalculation.cgstOnFood = parseFloat(Math.round((Number(rentalForCalculation.foodRevenue) + Number(rentalForCalculation.serviceChargeOnFood)) * foodCgst) / 100).toFixed(2);
    rentalForCalculation.sgstOnFood = parseFloat(Math.round((Number(rentalForCalculation.foodRevenue) + Number(rentalForCalculation.serviceChargeOnFood)) * foodSgst) / 100).toFixed(2);

    rentalForCalculation.totalForMemberShipDiscountOnFood = (Number(rentalForCalculation.totalOnFood) - Number(rentalForCalculation.membershipDiscountOnFood)).toFixed(2);

    rentalForCalculation.totalOnFood = parseFloat(Number(rentalForCalculation.foodRevenue) + Number(rentalForCalculation.serviceChargeOnFood) + Number(rentalForCalculation.cgstOnFood) + Number(rentalForCalculation.sgstOnFood)).toFixed(2);

    rentalForCalculation.subTotalAmountForCustomer = rentalForCalculation.totalOnFood;
    console.log(rentalForCalculation.deposit);
    if (rentalForCalculation.deposit == null) {
      rentalForCalculation.deposit = 0;
    }

    rentalForCalculation.totalAmountForCustomer = parseFloat(Math.round((Number(rentalForCalculation.subTotalAmountForCustomer) - Number(rentalForCalculation.deposit)) * 100) / 100).toFixed(2);
    console.log(rentalForCalculation.totalAmountForCustomer);

    return rentalForCalculation;
  }
/*  ************************* get food order for the rental function ends*************************** */


/* *********************  get all sub rental for rental  ********************************** */
  function getAllRentalsForActiveRental (rentalForCalculationOfGame, rentals, gracePeriodForGames, isWeekend, chargeMultiplierWithoutFood, serviceCharge, serviceTaxParameter, gameCgst, gameSgst) {
    var rentalsForActiveRental = [];
    var gameRentalTemp;
    rentalForCalculationOfGame.gameRevenue = 0;
    rentalForCalculationOfGame.noOfMilisecond = 0;
    rentalForCalculationOfGame.cgstOnGame = 0;
    rentalForCalculationOfGame.sgstOnGame = 0;
    rentalForCalculationOfGame.totalOnGame = 0;
    // rentalForCalculationOfGame.totalOnFood = 0;
    var currentRental = rentalForCalculationOfGame;
    var j = 0;
/*   var gracePeriodSystemParameter = (filterFilter($scope.systemparameters, {systemParameterName : 'Grace Period'})).pop();
var gracePeriod = Number(gracePeriodSystemParameter.value); */
    var gracePeriod = Number(gracePeriodForGames);

/*     var weekendSystemParameter = (filterFilter($scope.systemparameters, {systemParameterName : 'Weekend Holiday Today'})).pop();
    var weekend = weekendSystemParameter.value; */
    var weekend = isWeekend;

    while (currentRental) {
      gameRentalTemp = currentRental;
      gameRentalTemp.noOfMilisecond = (gameRentalTemp.activeRental === true ? (new Date()).getTime() : (new Date(currentRental.rentalEnd)).getTime()) - (new Date(currentRental.renewalRentalStart)).getTime();
      rentalsForActiveRental.push(gameRentalTemp);

      if (currentRental.renewalRental) {
        for (j = 0; j < rentals.length; j++) {
          if (rentals[j]._id === currentRental.renewalRental) {
            currentRental = rentals[j];
            break;
          }
        }
      } else currentRental = '';
    }

    var summarizedGameRentals = [];
    var summarizedGameRentalsForCategoryId = [];
    var tempGameRental;
    var tempIndexForGame;
    var tempGameRentalForCategory;

    for (var k = 0; k < rentalsForActiveRental.length; k++) {
      // console.log(rentalsForActiveRental[k]);
      if (summarizedGameRentalsForCategoryId.indexOf(rentalsForActiveRental[k].serial.product.category._id) < 0) {
        summarizedGameRentalsForCategoryId.push(rentalsForActiveRental[k].serial.product.category._id);
        // tempGameRental = {category: rentalsForActiveRental[k].serial.product.category};
        // $scope.test = {category : rentalsForActiveRental[k].serial.product.category , noOfMilisecond: rentalsForActiveRental[k].noOfMilisecond};
        // $scope.test = tempGameRental;
        summarizedGameRentals.push({ category: rentalsForActiveRental[k].serial.product.category, noOfMilisecond: rentalsForActiveRental[k].noOfMilisecond });
        // summarizedGameRentals.push( rentalsForActiveRental[k]);
      } else {
        tempIndexForGame = summarizedGameRentalsForCategoryId.indexOf(rentalsForActiveRental[k].serial.product.category._id);
        tempGameRentalForCategory = summarizedGameRentalsForCategoryId.splice(tempIndexForGame, 1).pop();
        tempGameRental = summarizedGameRentals.splice(tempIndexForGame, 1).pop();
        tempGameRental.noOfMilisecond = Number(tempGameRental.noOfMilisecond) + Number(rentalsForActiveRental[k].noOfMilisecond);
        summarizedGameRentalsForCategoryId.push(tempGameRental.category._id);
        summarizedGameRentals.push(tempGameRental);
      }
    }

    var hours = 0;
    var minutes = 0;

    // $scope.test = rentalsForActiveRental;
    for (var m = 0; m < summarizedGameRentals.length; m++) {
      hours = Math.floor((Number(summarizedGameRentals[m].noOfMilisecond) + 30000) / 3600000);
      minutes = Math.round((Number(summarizedGameRentals[m].noOfMilisecond) - hours * 3600000) / 60000);
      summarizedGameRentals[m].timePlayed = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
      // summarizedGameRentals[m].hoursCharged = Math.ceil((Number(summarizedGameRentals[m].noOfMilisecond) - gracePeriod * 60000)/3600000);
      // $scope.test=summarizedGameRentals[m].isMember;
      summarizedGameRentals[m].hoursCharged = (rentalForCalculationOfGame.isMember === true ? 0 : Math.ceil((Number(summarizedGameRentals[m].noOfMilisecond) - gracePeriod * 60000) / 3600000));
      console.log(chargeMultiplierWithoutFood);
      summarizedGameRentals[m].ratePerHourCharged = parseFloat(Math.round(chargeMultiplierWithoutFood * (weekend === 'Y' ? summarizedGameRentals[m].category.ratePerHourWeekendHoliday : summarizedGameRentals[m].category.ratePerHourWeekday) * 100) / 100).toFixed(2);

      summarizedGameRentals[m].amountCharged = parseFloat(Math.round(summarizedGameRentals[m].hoursCharged * summarizedGameRentals[m].ratePerHourCharged * 100) / 100).toFixed(2);

      rentalForCalculationOfGame.gameRevenue = parseFloat(Math.round((Number(rentalForCalculationOfGame.gameRevenue) + Number(summarizedGameRentals[m].amountCharged)) * 100) / 100).toFixed(2);
    }
    // rentalForCalculationOfGame.games = [];
    rentalForCalculationOfGame.games = summarizedGameRentals;
    // console.log(gameCgst);
    rentalForCalculationOfGame.serviceChargeOnGame = parseFloat(Math.round(Number(rentalForCalculationOfGame.gameRevenue) * serviceCharge) / 100).toFixed(2);
    rentalForCalculationOfGame.cgstOnGame = parseFloat(Math.round((Number(rentalForCalculationOfGame.gameRevenue) + Number(rentalForCalculationOfGame.serviceChargeOnGame)) * gameCgst) / 100).toFixed(2);
    // console.log(rentalForCalculationOfGame.gameRevenue);
    rentalForCalculationOfGame.sgstOnGame = parseFloat(Math.round((Number(rentalForCalculationOfGame.gameRevenue) + Number(rentalForCalculationOfGame.serviceChargeOnGame)) * gameSgst) / 100).toFixed(2);

    rentalForCalculationOfGame.totalOnGame = parseFloat(Number(rentalForCalculationOfGame.gameRevenue) + Number(rentalForCalculationOfGame.serviceChargeOnGame) + Number(rentalForCalculationOfGame.cgstOnGame) + Number(rentalForCalculationOfGame.sgstOnGame)).toFixed(2);
    rentalForCalculationOfGame.subTotalAmountForCustomer = parseFloat(Math.round((Number(rentalForCalculationOfGame.totalOnGame) + Number(rentalForCalculationOfGame.totalOnFood)) * 100) / 100).toFixed(2);

    if (rentalForCalculationOfGame.deposit == null) {
      rentalForCalculationOfGame.deposit = 0;
    }

    rentalForCalculationOfGame.totalAmountForCustomer = parseFloat(Math.round((Number(rentalForCalculationOfGame.subTotalAmountForCustomer) - Number(rentalForCalculationOfGame.deposit)) * 100) / 100).toFixed(2);

    return rentalForCalculationOfGame;
  }
/* *********************  get all sub rental for rental  ends********************************** */

/* *********************  make package effect for rental  ********************************** */
  function packageEffectForRental (rentalForCalculationOfPackage, packageorders, rentals, packageFoodTypes, chargeMultiplierWithFood, serviceCharge, vat, serviceTaxRateWithFood, isWeekend, gracePeriodForGames, serviceTaxParameter, endTimeForActiveRental, packageCgst, packageSgst, gameCgst, gameSgst, foodCgst, foodSgst) {

    var i = 0;
    var j = 0;
    var packageOrderTemp;
    var currentRental = rentalForCalculationOfPackage;
    var packageOrdersForRentals = [];
    var packageRevenueSubTotal = 0;
    rentalForCalculationOfPackage.packageRevenue = 0;
    rentalForCalculationOfPackage.serviceChargeOnPackage = 0;
    // rental.vatOnPackage = 0;
    rentalForCalculationOfPackage.serviceTaxOnPackage = 0;
    rentalForCalculationOfPackage.cgstOnPackage = 0;
    rentalForCalculationOfPackage.sgstOnPackage = 0;
    rentalForCalculationOfPackage.totalOnPackage = 0;
    while (currentRental) {
      for (i = 0; i < packageorders.length; i++) {
        if (packageorders[i].rental === currentRental._id) {
          packageOrderTemp = packageorders[i];
          packageOrderTemp.billPrice = parseFloat(Math.round(packageorders[i].package.packagePrice * chargeMultiplierWithFood * 100) / 100).toFixed(2);
          packageRevenueSubTotal = packageRevenueSubTotal + Number(packageOrderTemp.billPrice);
          packageOrdersForRentals.push(packageOrderTemp);
          console.log(packageOrderTemp.billPrice);
        }
      }
      if (currentRental.renewalRental) {
        for (j = 0; j < rentals.length; j++) {
          if (rentals[j]._id === currentRental.renewalRental) {
            currentRental = rentals[j];
            break;
          }
        }
      } else currentRental = null;
    }

    var summarizedPackageOrdersForRentals = [];
    var summarizedPackageIdForRentals = [];
    var tempIndex;
    var tempPackageOrderId;
    var tempPackageOrder;
    rentalForCalculationOfPackage.packageQuantityHigherThanOne = false;
    // $scope.test = packageOrdersForRentals;
    for (i = 0; i < packageOrdersForRentals.length; i++) {
      if (summarizedPackageIdForRentals.indexOf(packageOrdersForRentals[i].package._id) < 0) {
        packageOrdersForRentals[i].quantity = 1;
        packageOrdersForRentals[i].billCharge = parseFloat(Number(packageOrdersForRentals[i].billPrice)).toFixed(2);
        summarizedPackageIdForRentals.push(packageOrdersForRentals[i].package._id);
        summarizedPackageOrdersForRentals.push(packageOrdersForRentals[i]);
      } else {
        tempIndex = summarizedPackageIdForRentals.indexOf(packageOrdersForRentals[i].package._id);
        tempPackageOrderId = summarizedPackageIdForRentals.splice(tempIndex, 1).pop();
        tempPackageOrder = summarizedPackageOrdersForRentals.splice(tempIndex, 1).pop();

        tempPackageOrder.quantity = Number(tempPackageOrder.quantity) + 1;
        tempPackageOrder.billCharge = parseFloat(Number(tempPackageOrder.billPrice) * tempPackageOrder.quantity).toFixed(2);

        summarizedPackageIdForRentals.push(tempPackageOrder.package._id);

        summarizedPackageOrdersForRentals.push(tempPackageOrder);
        rentalForCalculationOfPackage.packageQuantityHigherThanOne = true;
      }
    }

    rentalForCalculationOfPackage.packageorders = summarizedPackageOrdersForRentals;
    rentalForCalculationOfPackage.packageRevenue = parseFloat(Math.round(Number(packageRevenueSubTotal) * 100) / 100).toFixed(2);
    rentalForCalculationOfPackage.serviceChargeOnPackage = parseFloat(Math.round(Number(packageRevenueSubTotal) * serviceCharge) / 100).toFixed(2);
    rentalForCalculationOfPackage.cgstOnPackage = parseFloat(Math.round((Number(rentalForCalculationOfPackage.packageRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnPackage)) * packageCgst) / 100).toFixed(2);
    rentalForCalculationOfPackage.sgstOnPackage = parseFloat(Math.round((Number(rentalForCalculationOfPackage.packageRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnPackage)) * packageSgst) / 100).toFixed(2);
    // rentalForCalculationOfPackage.serviceTaxOnPackage = parseFloat(Math.round((Number(rentalForCalculationOfPackage.packageRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnPackage)) * serviceTaxRateWithFood) / 100).toFixed(2);

    rentalForCalculationOfPackage.totalOnPackage = parseFloat(Number(rentalForCalculationOfPackage.packageRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnPackage) + Number(rentalForCalculationOfPackage.cgstOnPackage) + Number(rentalForCalculationOfPackage.sgstOnPackage)).toFixed(2);

    // sort packageorders
    rentalForCalculationOfPackage.packageorders = rentalForCalculationOfPackage.packageorders.sort(function(a, b) {
      return (isWeekend === 'Y' ? Number(b.package.category.ratePerHourWeekendHoliday) - Number(a.package.category.ratePerHourWeekendHoliday) : Number(b.package.category.ratePerHourWeekday) - Number(a.package.category.ratePerHourWeekday));
    });

    // sort games
    rentalForCalculationOfPackage.games = rentalForCalculationOfPackage.games.sort(function(a, b) {
      console.log(b.category.ratePerHourWeekday);
      return (isWeekend === 'Y' ? Number(b.category.ratePerHourWeekendHoliday) - Number(a.category.ratePerHourWeekendHoliday) : Number(b.category.ratePerHourWeekday) - Number(a.category.ratePerHourWeekday));
    });

    // Append packageorders
    var stringPackageHours = '';
    var hours = 0;
    var minutes = 0;
    var tempDate;
    // var noOfMilisecondsToBeReduced = 0;
    // var noOfMilisecondsToBeReducedRemaining = 0;
    for (i = 0; i < rentalForCalculationOfPackage.packageorders.length; i++) {
      stringPackageHours = String(rentalForCalculationOfPackage.packageorders[i].package.hours);
      // hours = stringPackageHours.slice(11, stringPackageHours.indexOf(':'));
      // minutes = stringPackageHours.slice(stringPackageHours.indexOf(':') + 1, stringPackageHours.indexOf(':') + 3);
      tempDate = new Date(rentalForCalculationOfPackage.packageorders[i].package.hours);
      hours = tempDate.getHours();
      minutes = tempDate.getMinutes();
      console.log(hours);
      console.log(minutes);
      rentalForCalculationOfPackage.packageorders[i].noOfMilisecondsToBeReduced = (Number(hours) * 3600000 + Number(minutes) * 60000) * rentalForCalculationOfPackage.packageorders[i].quantity;
      rentalForCalculationOfPackage.packageorders[i].noOfMilisecondsToBeReducedRemaining = rentalForCalculationOfPackage.packageorders[i].noOfMilisecondsToBeReduced;
      // console.log(rentalForCalculationOfPackage.packageorders[i].noOfMilisecondsToBeReducedRemaining);
    }

    // Package Game effects
    rentalForCalculationOfPackage.gameRevenue = 0;

    for (i = 0; i < rentalForCalculationOfPackage.games.length; i++) {
      console.log(rentalForCalculationOfPackage.games[i]);
      for (j = 0; j < rentalForCalculationOfPackage.packageorders.length; j++) {
        console.log(rentalForCalculationOfPackage.games[i].noOfMilisecond);
        if ((isWeekend === 'Y' ? rentalForCalculationOfPackage.games[i].category.ratePerHourWeekendHoliday <= rentalForCalculationOfPackage.packageorders[j].package.category.ratePerHourWeekendHoliday : rentalForCalculationOfPackage.games[i].category.ratePerHourWeekday <= rentalForCalculationOfPackage.packageorders[j].package.category.ratePerHourWeekday) && rentalForCalculationOfPackage.games[i].noOfMilisecond > 0 && rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining > 0) {
          console.log(rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining);
          console.log(rentalForCalculationOfPackage.games[i].noOfMilisecond);
          if (rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining > rentalForCalculationOfPackage.games[i].noOfMilisecond) {
            console.log(rentalForCalculationOfPackage.games[i].noOfMilisecond);
            rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining = Number(rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining) - rentalForCalculationOfPackage.games[i].noOfMilisecond;
            rentalForCalculationOfPackage.games[i].noOfMilisecond = 0;
            console.log(rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining);
          } else {
            console.log('false');
            rentalForCalculationOfPackage.games[i].noOfMilisecond = Number(rentalForCalculationOfPackage.games[i].noOfMilisecond) - Number(rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining);
            rentalForCalculationOfPackage.packageorders[j].noOfMilisecondsToBeReducedRemaining = 0;
            console.log(rentalForCalculationOfPackage.games[i].noOfMilisecond);
          }
        }
      }
      rentalForCalculationOfPackage.games[i].hoursCharged = Math.max(0, Math.ceil((Number(rentalForCalculationOfPackage.games[i].noOfMilisecond) - gracePeriodForGames * 60000) / 3600000));

      rentalForCalculationOfPackage.games[i].amountCharged = parseFloat(Math.round(rentalForCalculationOfPackage.games[i].hoursCharged * Number(rentalForCalculationOfPackage.games[i].ratePerHourCharged) * 100) / 100).toFixed(2);

      rentalForCalculationOfPackage.gameRevenue = parseFloat(Math.round((Number(rentalForCalculationOfPackage.gameRevenue) + Number(rentalForCalculationOfPackage.games[i].amountCharged)) * 100) / 100).toFixed(2);
      console.log(rentalForCalculationOfPackage.gameRevenue);
    }

    rentalForCalculationOfPackage.serviceChargeOnGame = parseFloat(Math.round(Number(rentalForCalculationOfPackage.gameRevenue) * serviceCharge) / 100).toFixed(2);
    // rentalForCalculation.vatOnFood =  parseFloat(Math.round((Number(rentalForCalculation.foodRevenue) + Number(rentalForCalculation.serviceChargeOnFood)) * $scope.vat)/100).toFixed(2);
    // rental.serviceTaxOnGame = parseFloat(Math.round((Number(rental.gameRevenue) + Number(rental.serviceChargeOnGame)) * serviceTaxParameter) / 100).toFixed(2);
    rentalForCalculationOfPackage.cgstOnGame = parseFloat(Math.round((Number(rentalForCalculationOfPackage.gameRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnGame)) * gameCgst) / 100).toFixed(2);
    console.log(rentalForCalculationOfPackage.gameRevenue);
    rentalForCalculationOfPackage.sgstOnGame = parseFloat(Math.round((Number(rentalForCalculationOfPackage.gameRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnGame)) * gameSgst) / 100).toFixed(2);

    rentalForCalculationOfPackage.totalOnGame = parseFloat(Number(rentalForCalculationOfPackage.gameRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnGame) + Number(rentalForCalculationOfPackage.cgstOnGame) + Number(rentalForCalculationOfPackage.sgstOnGame)).toFixed(2);

    // + Number(rental.serviceTaxOnGame)
    // Package food effects
    rentalForCalculationOfPackage.foodRevenue = 0;
    var tempPackageFoodTypes = [];
    // var k=0;
    for (i = 0; i < packageFoodTypes.length; i++) {
      for (j = 0; j < rentalForCalculationOfPackage.packageorders.length; j++) {
        if (rentalForCalculationOfPackage.packageorders[j].package._id === packageFoodTypes[i].package) {
          packageFoodTypes[i].packageQuantity = rentalForCalculationOfPackage.packageorders[j].quantity;
          tempPackageFoodTypes.push(packageFoodTypes[i]);
        }
      }
    }

    // Summarize and add to rental.packageFoodTypes
    rentalForCalculationOfPackage.packageFoodTypes = [];

    var summarizedFoodTypes = [];
    var summarizedFoodTypeIds = [];
    var tempIndexFoodType;
    var tempFoodTypeId;
    var tempFoodType;

    for (i = 0; i < tempPackageFoodTypes.length; i++) {
      if (summarizedFoodTypeIds.indexOf(tempPackageFoodTypes[i].foodtype._id) < 0) {
        summarizedFoodTypeIds.push(tempPackageFoodTypes[i].foodtype._id);
        tempPackageFoodTypes[i].netQuantity = Number(tempPackageFoodTypes[i].quantity) * Number(tempPackageFoodTypes[i].packageQuantity);
        summarizedFoodTypes.push(tempPackageFoodTypes[i]);
      } else {
        tempIndexFoodType = summarizedFoodTypeIds.indexOf(tempPackageFoodTypes[i].foodtype._id);
        tempFoodTypeId = summarizedFoodTypeIds.splice(tempIndexFoodType, 1).pop();
        tempFoodType = summarizedFoodTypes.splice(tempIndexFoodType, 1).pop();
        tempFoodType.netQuantity = Number(tempFoodType.netQuantity) + (Number(tempPackageFoodTypes[i].quantity) * Number(tempPackageFoodTypes[i].packageQuantity));
        summarizedFoodTypeIds.push(tempFoodType.foodtype._id);
        summarizedFoodTypes.push(tempFoodType);
      }
    }
    rentalForCalculationOfPackage.packageFoodTypes = summarizedFoodTypes;

    // sort food orders by most expensive first
    // var sortedFoodOrders = [];
    rentalForCalculationOfPackage.foodorders = rentalForCalculationOfPackage.foodorders.sort(function(a, b) {
      if (a.food.foodtype.foodTypeName < b.food.foodtype.foodTypeName)
        return -1;
      else if (a.food.foodtype.foodTypeName > b.food.foodtype.foodTypeName)
        return 1;
      else
        return (Number(b.food.price) - Number(a.food.price));
    });
    // reduce foodorders
    var tempNetQuantity = 0;

    for (i = 0; i < rentalForCalculationOfPackage.packageFoodTypes.length; i++) {
      tempNetQuantity = rentalForCalculationOfPackage.packageFoodTypes[i].netQuantity;

      for (j = 0; j < rentalForCalculationOfPackage.foodorders.length; j++) {
        console.log(rentalForCalculationOfPackage.foodorders[j].food.foodtype._id);
        console.log(rentalForCalculationOfPackage.packageFoodTypes[i].foodtype._id);
        if (rentalForCalculationOfPackage.foodorders[j].food.foodtype._id === rentalForCalculationOfPackage.packageFoodTypes[i].foodtype._id) {
          if (rentalForCalculationOfPackage.foodorders[j].quantity < tempNetQuantity) {
            tempNetQuantity = tempNetQuantity - rentalForCalculationOfPackage.foodorders[j].quantity;
            rentalForCalculationOfPackage.foodorders[j].quantityCharged = 0;
            rentalForCalculationOfPackage.foodorders[j].billCharge = parseFloat(Number(rentalForCalculationOfPackage.foodorders[j].billPrice) * rentalForCalculationOfPackage.foodorders[j].quantityCharged).toFixed(2);
          } else {
            rentalForCalculationOfPackage.foodorders[j].quantityCharged = rentalForCalculationOfPackage.foodorders[j].quantity - tempNetQuantity;
            tempNetQuantity = 0;
            rentalForCalculationOfPackage.foodorders[j].billCharge = parseFloat(Number(rentalForCalculationOfPackage.foodorders[j].billPrice) * rentalForCalculationOfPackage.foodorders[j].quantityCharged).toFixed(2);
            // break;
          }
        }
      }
    }
    rentalForCalculationOfPackage.foodRevenue = 0;
    // update food revenue and taxes and totals
    for (j = 0; j < rentalForCalculationOfPackage.foodorders.length; j++) {
      rentalForCalculationOfPackage.foodRevenue = Number(rentalForCalculationOfPackage.foodRevenue) + Number(rentalForCalculationOfPackage.foodorders[j].billCharge);
    }
    console.log(rentalForCalculationOfPackage.foodRevenue);
    rentalForCalculationOfPackage.foodRevenue = parseFloat(Math.round(Number(rentalForCalculationOfPackage.foodRevenue) * 100) / 100).toFixed(2);
    rentalForCalculationOfPackage.serviceChargeOnFood = parseFloat(Math.round(Number(rentalForCalculationOfPackage.foodRevenue) * serviceCharge) / 100).toFixed(2);
    // rental.vatOnFood = parseFloat(Math.round((Number(rental.foodRevenue) + Number(rental.serviceChargeOnFood)) * vat) / 100).toFixed(2);
    // rental.serviceTaxOnFood = parseFloat(Math.round((Number(rental.foodRevenue) + Number(rental.serviceChargeOnFood)) * serviceTaxRateWithFood) / 100).toFixed(2);
    rentalForCalculationOfPackage.serviceChargeOnFood = parseFloat(Math.round(Number(rentalForCalculationOfPackage.foodRevenue) * serviceCharge) / 100).toFixed(2);

    rentalForCalculationOfPackage.cgstOnFood = parseFloat(Math.round((Number(rentalForCalculationOfPackage.foodRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnFood)) * foodCgst) / 100).toFixed(2);

    rentalForCalculationOfPackage.sgstOnFood = parseFloat(Math.round((Number(rentalForCalculationOfPackage.foodRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnFood)) * foodSgst) / 100).toFixed(2);

    rentalForCalculationOfPackage.totalOnFood = parseFloat(Number(rentalForCalculationOfPackage.foodRevenue) + Number(rentalForCalculationOfPackage.serviceChargeOnFood) + Number(rentalForCalculationOfPackage.cgstOnFood) + Number(rentalForCalculationOfPackage.sgstOnFood)).toFixed(2);

    // update customer totals
    rentalForCalculationOfPackage.subTotalAmountForCustomer = parseFloat(Math.round((Number(rentalForCalculationOfPackage.totalOnGame) + Number(rentalForCalculationOfPackage.totalOnFood) + Number(rentalForCalculationOfPackage.totalOnPackage)) * 100) / 100).toFixed(2);

    if (rentalForCalculationOfPackage.deposit == null) {
      rentalForCalculationOfPackage.deposit = 0;
    }

    rentalForCalculationOfPackage.totalAmountForCustomer = parseFloat(Math.round((Number(rentalForCalculationOfPackage.subTotalAmountForCustomer) - Number(rentalForCalculationOfPackage.deposit)) * 100) / 100).toFixed(2);
    rentalForCalculationOfPackage.endTimeForActiveRental = endTimeForActiveRental;
    return rentalForCalculationOfPackage;
  }
/* *********************  make package effect for rental ends ********************************** */

  return {
    getFoodOrders: getFoodOrders,
    getAllRentalsForActiveRental: getAllRentalsForActiveRental,
    packageEffectForRental: packageEffectForRental
  };
});
