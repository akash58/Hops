'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  // User = mongoose.model('User'),
	// Membershipactivity = mongoose.model('Membershipactivity'),
	// Billmembershiparchive=mongoose.model('Billmembershiparchive'),
  _ = require('lodash');


/**
 *map reduce function to get total revenue for a day
 */

exports.summary = function(req, res) {
  var startDate = new Date(req.query.startDate);
  startDate.setUTCHours(0, 0, 0, 0);
// var dateQueried = (new Date(req.query.date)).getTime();
// console.log(req.query.date);
// console.log(dateQueried);
  var o = {};
  o.map = 'function () { emit(1, {billPrice : this.billPrice, serviceTaxOnMembership : this.serviceTaxOnMembership} ) }';
  o.reduce = function (k, vals) {
    var billPrice = 0;
    var serviceTaxOnMembership = 0;
    console.log('map in totalMembershipRevenueOfDays');
    console.log(vals);
    console.log('mapOut');
    for (var j = 0; j < vals.length; j++) {
      billPrice += vals[j].billPrice;
      serviceTaxOnMembership += vals[j].serviceTaxOnMembership;
    }
    return { billPrice: billPrice, serviceTaxOnMembership: serviceTaxOnMembership };
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  o.query = { dateOfBill: { $gte: startDate, $lte: req.query.endDate } };

  console.log('IN totalMembershipRevenueOfDays..............');
  // console.log(req);
  req.db.Membershipactivities.mapReduce(o, function(err, membershipSummary, stats) {
      // console.log('map reduce took %d ms', stats.processtime);
    console.log('Called susccus totalMembershipRevenueOfDays');
    console.log('membershipSummary' + membershipSummary);
    if (err) {
      console.log('err : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var daysSummary = { billPrice: 0, serviceTaxOnMembership: 0 };
      for (var i = 0; i < membershipSummary.length; i++) {
        daysSummary.billPrice += membershipSummary[i].value.billPrice;
        daysSummary.serviceTaxOnMembership += membershipSummary[i].value.serviceTaxOnMembership;
      }
      res.json(daysSummary);
    }
  });
};
