'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.summary = function(req, res) {
  var dateQueriedString = req.query.startDate;
 // console.log("dateQueriedString = " + dateQueriedString);
  var dateQueried = new Date(req.query.date);

  var dateQueriedString1 = req.query.endDate;
  // console.log("dateQueriedString1 =" + dateQueriedString1);

  var day = dateQueriedString.substring(8, 10);
  // console.log(day);
  var month = dateQueriedString.substring(5, 7) - 1;
  // console.log(month);
  var year = dateQueriedString.substring(0, 4);
  // console.log(year);

  var date = new Date(year, month, day);
  // console.log(date);

  var day1 = dateQueriedString1.substring(8, 10);
  // console.log(day1);
  var month1 = dateQueriedString1.substring(5, 7) - 1;
  // console.log(month1);
  var year1 = dateQueriedString1.substring(0, 4);
  // console.log(year1);

  var date1 = new Date(year1, month1, day1);
  // console.log(date1);

  date1.setDate(date1.getDate() + 1);
  // console.log(date1);

  var o = {};

  o.map = 'function () {  var dow = this.orderTime.getDay(); emit(this.food, { quantity: this.quantity, foodOrders: [this] }) }';
  o.reduce = function(k, vals) {
    var reducedObj = {
      quantity: 0,
      foodOrders: []
    };

    vals.forEach(function(value) {
      reducedObj.quantity += value.quantity;
      value.foodOrders.forEach(function(foodOrder) {
        // delete foodOrder.user;
        reducedObj.foodOrders.push(foodOrder);
      });
      // for(var i=0;i < value.foodOrders.length;i++){
      //  delete value.foodOrders[i]['user'];
      //  reducedObj.foodOrders.push(value.foodOrders[i]);
      // }
    });
    return reducedObj;
    // return Array.sum(vals);
  };
  o.reduce = o.reduce.toString();
  o.verbose = true;
  o.query = { orderTime: { $gte: date, $lte: date1 } };
  // console.log("IN1");
  // console.log(o.query);
  // console.log("out..");

  req.db.Foodorderarchive.mapReduce(o, function(err, mapReduceresults, stats) {
    // console.log('Called...................................');
    // console.log(JSON.stringify(mapReduceresults));
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts = {
        model: 'Food',
        path: '_id'
      };
      req.db.Food.populate(mapReduceresults, opts, function (err, deepMapReduceresults) {
        if (err) {
          // console.log(err);
        } else {
          var opts1 = {
            model: 'Foodtype',
            path: '_id.foodtype'
          };
          req.db.Foodtype.populate(deepMapReduceresults, opts1, function (err, results) {
            console.log(results);
            if (err) {
              console.log(err);
            } else {
          // console.log('Called2222222222222222');
          // console.log(JSON.stringify(results));
              var foodTypeArray = [],
                foodTypeObjArray = [],
                foodTypeObj = {},
                revenueByfoodType = 0,
                orderItemInfoodTypes = 0,
                resultObj = {};
              for (var i = 0; i < results.length; i++) {
                console.log(results[i]);
                // console.log(results);
               /* console.log(results[i].value.quantity);
                console.log(results[i]._id.price);*/
                results[i].revenueByFood = results[i].value.quantity * results[i]._id.price;
          // console.log(results[i]);
          // console.log(results[i]._id.price);
                if (foodTypeArray.indexOf(results[i]._id.foodtype._id) < 0) {
                  foodTypeArray.push(results[i]._id.foodtype._id);
                  foodTypeObj._id = results[i]._id.foodtype._id;
                  foodTypeObj.orderItemInfoodTypes = results[i].value.quantity;
                  foodTypeObj.foodTypeName = results[i]._id.foodtype.foodTypeName;
                  foodTypeObj.totalRevenue = results[i].revenueByFood;
                  foodTypeObjArray.push(foodTypeObj);
                  foodTypeObj = {};
                } else {
                  var index = _.findIndex(foodTypeObjArray, { _id: results[i]._id.foodtype._id });
                  foodTypeObjArray[index].orderItemInfoodTypes += results[i].value.quantity;
                  foodTypeObjArray[index].totalRevenue += results[i].revenueByFood;
                }
                for (var j = 0; j < results[i].value.foodOrders.length; j++) {
                  delete results[i].value.foodOrders[j].user;
                  delete results[i].value.foodOrders[j].foodOrder;
                  delete results[i].value.foodOrders[j].rental;
                  delete results[i].value.foodOrders[j].customer;
                  delete results[i].value.foodOrders[j].userOrignal;
                  delete results[i].value.foodOrders[j].status;
                  delete results[i].value.foodOrders[j].__v;
                  delete results[i].value.foodOrders[j].createdOrignal;
                  delete results[i].value.foodOrders[j].rentalarchive;
                }
              }
          // console.log(foodTypeObjArray);
              resultObj.food = results;
              resultObj.foodTypeObjArray = foodTypeObjArray;
              res.json(resultObj);
            }
          });
        }
      });
    }
  });
};
