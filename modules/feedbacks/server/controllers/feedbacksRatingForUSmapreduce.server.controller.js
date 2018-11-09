'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


exports.summary = function(req, res) {
  var o = {};

  o.map = 'function () { emit(this.games, 1); }';
  o.reduce = function (k, vals) {

    return Array.sum(vals);
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  o.query = { DateOfCreation: { $gte: req.query.startDate, $lte: req.query.endDate } };

  req.db.Feedback.mapReduce(o, function(err, feedbackSummaryForRatingForUS, stats) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var allTotal = 0;

      for (var i = 0; i < feedbackSummaryForRatingForUS.length; i++) {
        allTotal += feedbackSummaryForRatingForUS[i].value;
      }

      for (var j = 0; j < feedbackSummaryForRatingForUS.length; j++) {

        feedbackSummaryForRatingForUS[j].percentage = (Number(feedbackSummaryForRatingForUS[j].value * 100) / Number(allTotal)).toFixed(2);
      }

      res.jsonp(feedbackSummaryForRatingForUS);
    }
  });
};
