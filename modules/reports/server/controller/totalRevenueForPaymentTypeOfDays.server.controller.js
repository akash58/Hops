'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  // errorHandler = require('./errors.server.controller'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  User = mongoose.model('User'),
  // Payment = mongoose.model('Payment'),
  _ = require('lodash');

/**
 *map reduce function to get total revenue for a day
 */

exports.summary = function(req, res) {
  var dateQueriedString = req.query.startDate;
  var dateQueried = new Date(req.query.date);
  var dateQueriedString1 = req.query.endDate;
  var day = dateQueriedString.substring(8, 10);
  var month = dateQueriedString.substring(5, 7) - 1;
  var year = dateQueriedString.substring(0, 4);
  var date = new Date(year, month, day);
  var day1 = dateQueriedString1.substring(8, 10);
  var month1 = dateQueriedString1.substring(5, 7) - 1;
  var year1 = dateQueriedString1.substring(0, 4);
  var date1 = new Date(year1, month1, day1);
  // console.log(req.query.date);
  // console.log(dateQueried);
  // console.log(dateQueriedPlus1);
  // var dateQueriedPlus1 = dateQueried;
  date1.setDate(date1.getDate() + 1);
	/* console.log(date);
	console.log(date1);
	console.log( new Date(2015,8,26) );
	console.log(dateQueriedPlus1); */

  var o = {};
  o.map = 'function () { emit(this.paymentModeType, this.paidAmount) }';
  o.reduce = function (k, vals) {
    return Array.sum(vals);
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  o.query = { created: { $gte: date, // dateQueried.toISOString()
    $lt: date1 // dateQueriedPlus1.toISOString()
  } };

  req.db.Payment.mapReduce(o, function(err, paymentTypeSummary, stats) {
   // console.log('map reduce took %d ms', stats.processtime);
    console.log('Called susccess paymentTypeSummary');
    console.log('paymentTypeSummary' + paymentTypeSummary);
    if (err) {
      // console.log('err : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(paymentTypeSummary);
      var opts = {
        model: 'PaymentModeType',
        path: '_id'
        // select: 'paymentType'
      };
      req.db.Payment.populate(paymentTypeSummary, opts, function (err, paymentTypeSummary) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
                // var dateMatch =
                 /* var totaldays=;
                 for(var i=0;i<paymentTypeSummary.length;i++){
	       		    } */
          console.log('paymentTypeSummary : ' + JSON.stringify(paymentTypeSummary));
          res.json(paymentTypeSummary);
        }
      });
    }
  });
};
