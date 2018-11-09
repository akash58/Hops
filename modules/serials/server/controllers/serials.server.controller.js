'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Serial = mongoose.model('Serial'),
  _ = require('lodash');

/**
 * Create a serial
 */
exports.create = function(req, res) {
  // console.log(req.body);
  var serial = new req.db.Serial(req.body);

  serial.user = req.user;

  serial.save(function(err) {
    if (err) {
      // console.log('Error found is : '+ err);
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serial);
    }
  });
};

/**
 * Show the current serial
 */
exports.read = function(req, res) {
  res.json(req.serial);
};

/**
 * Update a serial
 */
exports.update = function(req, res) {
  // console.log(req.body);
  var serial = req.serial;

  serial = _.extend(serial, req.body);
  // console.log(serial);
  serial.save(function(err) {
    if (err) {
      // console.log('Error found is : '+ err);
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serial);
    }
  });
};

/**
 * Delete an serial
 */
/* exports.delete = function(req, res) {
  var serial = req.serial;

  serial.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(serial);
    }
  });
}; */

/**
 * List of serial
 */
exports.list = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  // console.log(req.query.renting);
  if (req.query.searchText) {
    req.db.Serial.find({ serialNumber: req.query.searchText, status: 'In Stock', renting: false }).sort('-created').populate('product').populate('supplier').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, serials) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(documents);
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(serials, opts1, function (err, serials) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(serials);
          }
        });
      }
    });
  } else {
    req.db.Serial.find({ status: 'In Stock', renting: false }).sort('-created').populate('product').populate('supplier').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, serials) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(documents);
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(serials, opts1, function (err, serials) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(serials);
          }
        });
      }
    });
  }
};

/**
 * Count of serial
 */
exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  if (req.query.searchText) {
    req.db.Serial.count({ serialNumber: req.query.searchText, status: 'In Stock' }).exec(function(err, serials_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d serials', serials_count);
        res.send({ count: serials_count });
      }
    });
  } else {
    req.db.Serial.count({ status: 'In Stock' }).exec(function(err, serials_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d serials', serials_count);
        res.send({ count: serials_count });
      }
    });
  }
};


/**
 * serial middleware
 */
exports.serialByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'serial is invalid'
    });
  }

  req.db.Serial.findById(id).exec(function (err, serial) {
    if (err) {
      return next(err);
    } else if (!serial) {
      return res.status(404).send({
        message: 'No serial with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(serial, opts, function (err, serial) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.serial = serial;
          next();
        }
      });
    }
  });
};
