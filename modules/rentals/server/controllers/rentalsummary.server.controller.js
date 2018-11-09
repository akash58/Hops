'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Rental = mongoose.model('Rental'),
  _ = require('lodash');

/**
 * List of rental
 */
exports.summary = function(req, res) {
  // console.log('test');
  req.db.Rental
    .aggregate()
      .match({ activeRental: true })
      .group({ _id: '$table', busyCount: { $sum: 1 }, maxRentalEndTime: { $max: '$rentalEnd' }, totalRevenue: { $sum: '$expectedRevenue' } })
      .exec(function(err, rentalsummary) {
        if (err) {
          // console.log('err : ' + err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // console.log('rentalsummary : ' + JSON.stringify(rentalsummary));
          res.json(rentalsummary);
        }
      });
};

exports.summary2 = function(req, res) {
  // console.log('test');
  var o = {};
  o.map = 'function () { emit(this.table, {busyCount: 1, maxRentalEndTime: this.rentalEnd}) }';
  o.reduce = function (k, vals) {
    var maxRentalEndTime = 0;
    for (var i = 0; i < vals.length; i++) {
      if (maxRentalEndTime < vals[i].maxRentalEndTime) {
        maxRentalEndTime = vals[i].maxRentalEndTime;
      }
    }
    return { busyCount: vals.length, maxRentalEndTime: maxRentalEndTime };
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  o.query = { activeRental: true };

  req.db.Rental
    .mapReduce(o, function(err, rentalsummary, stats) {
      console.log('map reduce took %d ms', stats.processtime);
      if (err) {
        console.log('err: ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var i = 0; i < rentalsummary.length; i++) {
          rentalsummary[i].busyCount = rentalsummary[i].value.busyCount;
          rentalsummary[i].maxRentalEndTime = rentalsummary[i].value.maxRentalEndTime;
        }

        console.log('rentalsummary: ' + JSON.stringify(rentalsummary));
        res.json(rentalsummary);
      }
    });
};
