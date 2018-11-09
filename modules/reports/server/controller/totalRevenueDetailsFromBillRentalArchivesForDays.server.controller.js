'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors.server.controller'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  User = mongoose.model('User'),
	/* Billrentalarchive = mongoose.model('Billrentalarchive'),
	Billarchive = mongoose.model('Billarchive'),*/
  _ = require('lodash');

/**
 *map reduce function to get total revenue for a day
 */

exports.summary = function(req, res) {
  var startDate = new Date(req.query.startDate);
  startDate.setUTCHours(0, 0, 0, 0);
   // console.log(req.query.startDate);
  req.db.Billarchive.find({ dateOfBill: { $gte: startDate, $lte: req.query.endDate } }, { _id: 1 }).sort('-created').exec(function(err, BillarchiveIds) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('ids' + BillarchiveIds);
      var billArchiveIdsArry = [];
      for (var a in BillarchiveIds) {
        if (BillarchiveIds.hasOwnProperty(a)) {
          billArchiveIdsArry.push(BillarchiveIds[a]._id);
        }
//        console.log(BillarchiveIds[0]._id);
      }


			// Billrentalarchive.find({billArchive: {$in : billArchiveIdsArry}}).sort('-created').exec(function(err, billrentalarchives) {
			// 	if (err) {
			// 		//console.log(err);
			// 		return res.status(400).send({
			// 			message: errorHandler.getErrorMessage(err)
			// 		});
			// 	} else {
			// 		// console.log(memberships);
			// 		res.json(billrentalarchives);
			// 	}
			// });
			// res.json(Billarchive);

			// var dateQueried = (new Date(req.query.date)).getTime();

			// console.log(BillarchiveIds);
			// console.log(billArchiveIdsArry);

      var o = {};
      o.map = 'function () { emit(1, {membershipDiscountOnFood: this.membershipDiscountOnFood, serviceTaxOnFood: this.serviceTaxOnFood, serviceChargeOnFood: this.serviceChargeOnFood, vatOnFood: this.vatOnFood, serviceTaxOnGame: this.serviceTaxOnGame, serviceChargeOnGame: this.serviceChargeOnGame, serviceTaxForPackage: this.serviceTaxForPackage, serviceChargeForPackage: this.serviceChargeForPackage, vatForPackage: this.vatForPackage, foodRevenue: this.foodRevenue, gameRevenue: this.gameRevenue, packageRevenue: this.packageRevenue, deposit: this.deposit}) }';
      o.reduce = function (k, vals) {
        console.log(vals);
        var membershipDiscountOnFood = 0;
        var serviceTaxOnFood = 0;
        var serviceChargeOnFood = 0;
        var vatOnFood = 0;
        var serviceTaxOnGame = 0;
        var serviceChargeOnGame = 0;
        var serviceTaxForPackage = 0;
        var serviceChargeForPackage = 0;
        var vatForPackage = 0;
        var foodRevenue = 0;
        var gameRevenue = 0;
        var packageRevenue = 0;
        var deposit = 0;

        for (var i = 0; i < vals.length; i++) {
          membershipDiscountOnFood += vals[i].membershipDiscountOnFood;
          serviceTaxOnFood += vals[i].serviceTaxOnFood;
          serviceChargeOnFood += vals[i].serviceChargeOnFood;
          vatOnFood += vals[i].vatOnFood;
          serviceTaxOnGame += vals[i].serviceTaxOnGame;
          serviceChargeOnGame += vals[i].serviceChargeOnGame;
          serviceTaxForPackage += vals[i].serviceTaxForPackage;
          serviceChargeForPackage += vals[i].serviceChargeForPackage;
          vatForPackage += vals[i].vatForPackage;
          foodRevenue += vals[i].foodRevenue;
          gameRevenue += vals[i].gameRevenue;
          packageRevenue += vals[i].packageRevenue;
          deposit += vals[i].deposit;
        }

  // return Array.sum(vals);
   // console.log(Array.sum(vals));
        return {
          membershipDiscountOnFood: membershipDiscountOnFood,
          serviceTaxOnFood: serviceTaxOnFood,
          serviceChargeOnFood: serviceChargeOnFood,
          vatOnFood: vatOnFood,
          serviceTaxOnGame: serviceTaxOnGame,
          serviceChargeOnGame: serviceChargeOnGame,
          serviceTaxForPackage: serviceTaxForPackage,
          serviceChargeForPackage: serviceChargeForPackage,
          vatForPackage: vatForPackage,
          foodRevenue: foodRevenue,
          gameRevenue: gameRevenue,
          packageRevenue: packageRevenue,
          deposit: deposit
        };
      };

      o.reduce = o.reduce.toString();
      o.verbose = true;
      o.query = { billArchive: { $in: billArchiveIdsArry } };

      // console.log(o);

      req.db.Billrentalarchive.mapReduce(o, function(err, billRentalSummary, stats) {
      // console.log('map reduce took %d ms', stats.processtime);
      // console.log('billRentalSummary = ' + Object.keys(billRentalSummary)[1]);
      // console.log('billRentalSummary_id =' + billRentalSummary,0);
        console.log('billRentalSummary stringify = ' + JSON.stringify(billRentalSummary, 1));
        if (err) {
          console.log('called');
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var daysSummary = { membershipDiscountOnFood: 0, serviceTaxOnFood: 0, serviceChargeOnFood: 0, vatOnFood: 0, serviceTaxOnGame: 0, serviceChargeOnGame: 0, serviceTaxForPackage: 0, serviceChargeForPackage: 0, vatForPackage: 0, foodRevenue: 0, gameRevenue: 0, packageRevenue: 0, noOfBills: 0, deposit: 0
          };

          console.log('billRentalSummary +length =' + billRentalSummary.length);
          console.log('billRentalSummary stringify for loop = ' + JSON.stringify(billRentalSummary, 1));
          for (var a = 0; a < billRentalSummary.length; a++) {
            console.log('billRentalSummary forloop =' + billRentalSummary[a].value.membershipDiscountOnFood);
            daysSummary.membershipDiscountOnFood = billRentalSummary[a].value.membershipDiscountOnFood;
            daysSummary.serviceTaxOnFood = billRentalSummary[a].value.serviceTaxOnFood;
            daysSummary.serviceChargeOnFood = billRentalSummary[a].value.serviceChargeOnFood;
            daysSummary.vatOnFood = billRentalSummary[a].value.vatOnFood;
            daysSummary.serviceTaxOnGame = billRentalSummary[a].value.serviceTaxOnGame;
            daysSummary.serviceChargeOnGame = billRentalSummary[a].value.serviceChargeOnGame;
            daysSummary.serviceTaxForPackage = billRentalSummary[a].value.serviceTaxForPackage;
            daysSummary.serviceChargeForPackage = billRentalSummary[a].value.serviceChargeForPackage;
            daysSummary.vatForPackage = billRentalSummary[a].value.vatForPackage;
            daysSummary.foodRevenue = billRentalSummary[a].value.foodRevenue;
            daysSummary.gameRevenue = billRentalSummary[a].value.gameRevenue;
            daysSummary.packageRevenue = billRentalSummary[a].value.packageRevenue;
            daysSummary.noOfBills = billRentalSummary[a].value.noOfBills;
            daysSummary.deposit = billRentalSummary[a].value.deposit;
          }

          daysSummary.noOfBills = BillarchiveIds.length;
          console.log(BillarchiveIds);
          res.json(daysSummary);
        }
      });
    }
  });
};
