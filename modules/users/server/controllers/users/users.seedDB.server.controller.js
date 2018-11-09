'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Systemparameter = mongoose.model('Systemparameter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs'),
  _ = require('lodash');

/**
* Insert many systemparameter
*/
var readAndInsertSysytemParameter = function(req, res) {
  return new Promise(function(resolve, reject) {
    fs.readFile('config/jsons/systemparameter.json', 'utf8', function (err, systemParameterStringData) {
      // var systemParameters = res;

      // console.log(res);
      var systemParameterJsonData = JSON.parse(systemParameterStringData);
      req.db.Systemparameter.insertMany(systemParameterJsonData, function(err, docs) {
        if (err) {
          reject(err);
          // console.log(err);
          // return res.status(400).send({
          //   message: errorHandler.getErrorMessage(err)
          // });
        } else {
          // res.json({ docs : docs });
          resolve(docs);
        }
      });

    });
  });
};

var readAndInsertPages = function(req, res) {
  return new Promise(function (resolve, reject) {
    fs.readFile('config/jsons/page.json', 'utf8', function (err, pagesStringData) {
      var pagesJsonData = JSON.parse(pagesStringData);
      req.db.Page.insertMany(pagesJsonData, function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  });
};

var readAndInsertIncrementParameter = function(req, res) {
  return new Promise(function (resolve, reject) {
    fs.readFile('config/jsons/incrementparameter.json', 'utf8', function(err, incrementStringData) {
      var incrementJsonData = JSON.parse(incrementStringData);
      req.db.Incrementparameter.insertMany(incrementJsonData, function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  });
};

var readAndInsertPaymentModeType = function(req, res) {
  return new Promise(function (resolve, reject) {
    fs.readFile('config/jsons/paymentmodetypes.json', 'utf8', function(err, modeTypeStringData) {
      var modeTypeJsonData = JSON.parse(modeTypeStringData);
      req.db.Paymentmodetype.insertMany(modeTypeJsonData, function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  });
};

var readAndInsertUnits = function(req, res) {
  return new Promise(function (resolve, reject) {
    fs.readFile('config/jsons/unitTypes.json', 'utf8', function(err, unitTypeStringData) {
      // var unitTypeJsonData = JSON.parse(JSON.stringify(unitTypeStringData));
      var unitTypeJsonData = JSON.parse(unitTypeStringData);
      var baseUnits = [];
      for (var i = 0; i < unitTypeJsonData.length; i++) {
        unitTypeJsonData[i]._id = new mongoose.Types.ObjectId();
        // var unit = new req.db.Unit();
        var unit = {};
        unit._id = new mongoose.Types.ObjectId();
        // console.log('test');
        // console.log(unit);
        unitTypeJsonData[i].baseUnitId = unit._id;
        unit.name = unitTypeJsonData[i].baseUnitName;
        unit.unitType = unitTypeJsonData[i]._id;
        unit.symbol = unitTypeJsonData[i].baseUnitSymbol;
        unit.multiplierWithBaseUnit = 1;
        unit.note = 'This unit is created by system but you can edit this';
        baseUnits.push(unit);
        for (var j = 0; j < unitTypeJsonData[i].units.length; j++) {
          unitTypeJsonData[i].units[j].unitType = unitTypeJsonData[i]._id;
          baseUnits.push(unitTypeJsonData[i].units[j]);
        }
        delete unitTypeJsonData[i].units;
      }
      // console.log(unitTypeJsonData);
      req.db.Unittype.insertMany(unitTypeJsonData, function(err, docs) {
        if (err) {
          reject(err);
        } else {
          // file read units
          // baseUnits.push new units from file which have been matched by name to a unitType
          req.db.Unit.insertMany(baseUnits, function(err, docs) {
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          });
          // console.log(docs);
          // resolve(docs);
        }
      });
    });
  });
};

exports.seedDB = function(req, res) {
  // console.log(req.db);
  readAndInsertSysytemParameter(req, res)
    .then(readAndInsertPages(req, res))
    .then(readAndInsertIncrementParameter(req, res))
    .then(readAndInsertPaymentModeType(req, res))
    .then(readAndInsertUnits(req, res))
  // readAndInsertUnits(req, res)
    .then(function(docs) {
      // res.json(docs);
      res.status(200).send();
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

