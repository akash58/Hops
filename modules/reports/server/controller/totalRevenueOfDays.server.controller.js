'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors.server.controller'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
	// Billarchive = mongoose.model('Billarchive'),
  User = mongoose.model('User'),
  _ = require('lodash');

/**
 *map reduce function to get total revenue for a day
 */

exports.summary = function(req, res) {
  var startDate = new Date(req.query.startDate);
  startDate.setUTCHours(0, 0, 0, 0);
  var o = {};
  o.map = 'function () { emit(1, { billTotal: this.billTotal, discountInValue: this.discountInValue, extraCharge: this.extraCharge, rounding: this.rounding }) }';
  o.reduce = function (k, vals) {
    var billTotal = 0;
    var discountInValue = 0;
    var extraCharge = 0;
    var rounding = 0;
    for (var j = 0; j < vals.length; j++) {
      billTotal += vals[j].billTotal;
      discountInValue += vals[j].discountInValue;
      extraCharge += vals[j].extraCharge;
      rounding += vals[j].rounding;
    }
     // return Array.sum(vals);
    return { billTotal: billTotal, discountInValue: discountInValue, extraCharge: extraCharge, rounding: rounding };

  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  console.log(o.query);
  o.query = { dateOfBill: { $gte: startDate, $lte: req.query.endDate } };

  req.db.Billarchive.mapReduce(o, function(err, billRevenue, stats) {
     // console.log('this is called');
     // console.log('map reduce took %d ms', stats.processtime);
    console.log('billRevenue : ' + JSON.stringify(billRevenue));
    if (err) {
    // console.log('err : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var totalRevenue = { billTotal: 0, discountInValue: 0, extraCharge: 0, rounding: 0 };
      for (var b = 0; b < billRevenue.length; b++) {
        totalRevenue.billTotal = billRevenue[b].value.billTotal;
        totalRevenue.discountInValue = billRevenue[b].value.discountInValue;
        totalRevenue.extraCharge = billRevenue[b].value.extraCharge;
        totalRevenue.rounding = billRevenue[b].value.rounding;
      }
      console.log('billRevenue2 : ' + JSON.stringify(totalRevenue));
      res.json(totalRevenue);
    }
  });
};
