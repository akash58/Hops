'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Bill = mongoose.model('Bill'),
  _ = require('lodash');

/**
 *map reduce function to get total revenue for a day
 */

exports.summary = function(req, res) {

  var o = {};
  o.map = 'function () { emit(this.table,{billUnpaidCount:1,billAmount: this.billTotal} ) }';
  // o.map = 'function () { emit(this.table, this.billTotal ) }';
  o.reduce = function (k, vals) {
    var billAmount = 0;
    for (var i = 0; i < vals.length; i++) {
      billAmount += vals[i].billAmount;
    }

    // return Array.sum(vals);
    return { billUnpaidCount: vals.length, billAmount: billAmount };
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  /* o.query = { created :{
                  $gte :date, //dateQueried.toISOString()
                  $lt : date1 //dateQueriedPlus1.toISOString()
                   } }; */

  req.db.Bill
    .mapReduce(o, function(err, unpaidBillSummary, stats) {
      // console.log('map reduce took %d ms', stats.processtime);
      if (err) {
        console.log('err : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
      /*  for (var i=0;i<rentalsummary.length;i++) {
          rentalsummary[i].busyCount = rentalsummary[i].value.busyCount;
          rentalsummary[i].maxRentalEndTime = rentalsummary[i].value.maxRentalEndTime;
        } */


        res.json(unpaidBillSummary);
      }
    });
};
