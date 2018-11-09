'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Billrental = mongoose.model('Billrental'),
  _ = require('lodash');

/**
 * Create a billrental
 */
exports.create = function(req, res) {
  // console.log(req.body);
  var billrental = new req.db.Billrental(req.body);
  billrental.user = req.user;
  billrental.save(function(err) {
    if (err) {
      // console.log('Error found is : '+ err);
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billrental);
    }
  });
};

/**
 * Show the current billrental
 */
exports.read = function(req, res) {
  res.json(req.billrental);
};

/**
 * Update a billrental
 */
/* exports.update = function(req, res) {
	//console.log(req.body);
	var billrental = req.billrental;

	billrental = _.extend(billrental, req.body);
	//console.log(billrental);
	billrental.save(function(err) {
		if (err) {
			console.log('Error found is : '+ err);
			//console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(billrental);
		}
	});
}; */

/**
 * Delete an billrental
 */
exports.delete = function(req, res) {
  var billrental = req.billrental;
  billrental.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billrental);
    }
  });
};

/**
 * List of billrental
 */
exports.list = function(req, res) {
  req.db.Billrental.find().sort('-created').populate('bill').populate('rental').exec(function(err, billrentals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var opts = {
        model: 'Serial',
        path: 'rental.serial'
        // select: 'productNumber component'
      };
      req.db.Billrental.populate(billrentals, opts, function (err, billrentals) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts = {
            model: 'Product',
            path: 'rental.serial.product'
           // select: 'productNumber component'
          };
          req.db.Billrental.populate(billrentals, opts, function (err, billrentals) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              var opts = {
                model: 'Category',
                path: 'rental.serial.product.category'
                // select: 'productNumber component'
              };
              req.db.Billrental.populate(billrentals, opts, function (err, billrentals) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  var opts = {
                    model: 'User',
                    path: 'bill.attendant'
                    // select: 'productNumber component'
                  };
                  req.db.Billrental.populate(billrentals, opts, function (err, billrentals) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      var opts = {
                        model: 'Customer',
                        path: 'rental.customer'
                        // select: 'productNumber component'
                      };
                      req.db.Billrental.populate(billrentals, opts, function (err, billrentals) {
                        if (err) {
                          return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                          });
                        } else {
                          // console.log(documents);
                          var opts1 = {
                            model: 'User',
                            path: 'user'
                          };
                          User.populate(billrentals, opts1, function (err, billrentals) {
                            if (err) {
                              return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                              });
                            } else {
                              res.json(billrentals);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

/**
 * billrental middleware
 */
exports.billrentalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill rental is invalid'
    });
  }

  req.db.Billrental.findById(id).exec(function (err, billrental) {
    if (err) {
      return next(err);
    } else if (!billrental) {
      return res.status(404).send({
        message: 'No Bill Rental with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billrental, opts, function (err, billrental) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billrental = billrental;
          next();
        }
      });
    }
  });
};
