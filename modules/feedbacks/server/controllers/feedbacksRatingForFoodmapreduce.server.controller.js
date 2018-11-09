'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


exports.summary = function(req, res) {
  var o = {};

  o.map = 'function () {emit(this.food,1)}';
  o.reduce = function (k, vals) {

    return Array.sum(vals);
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  o.query = { DateOfCreation: { $gte: req.query.startDate, $lte: req.query.endDate } };

  req.db.Feedback.mapReduce(o, function(err, feedbackSummaryForRatingForFood, stats) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var allTotal = 0;

      for (var i = 0; i < feedbackSummaryForRatingForFood.length; i++) {
        allTotal += feedbackSummaryForRatingForFood[i].value;
      }

      for (var j = 0; j < feedbackSummaryForRatingForFood.length; j++) {
        feedbackSummaryForRatingForFood[j].percentage = (Number(feedbackSummaryForRatingForFood[j].value * 100) / Number(allTotal)).toFixed(2);
      }
      res.jsonp(feedbackSummaryForRatingForFood);
    }
  });
};
