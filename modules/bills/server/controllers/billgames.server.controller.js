'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // BillGame = mongoose.model('BillGame'),
  _ = require('lodash');

/**
 * Create a billGame
 */
exports.create = function(req, res) {
  // console.log(req.body);
  var billGame = new req.db.Billgame(req.body);
  billGame.user = req.user;
  // console.log(foodOrderActivity);
  billGame.save(function(err) {
    if (err) {
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billGame);
    }
  });
};

/**
 * Show the current billGame
 */
exports.read = function(req, res) {
  res.json(req.billGame);
};

/**
 * Update a billGame
 */
/* exports.update = function(req, res) {

	var billGame = req.billGame;

	billGame = _.extend(billGame, req.body);

	billGame.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(billGame);
		}
	});
};
 */
/**
 * Delete an billGame
 */
exports.delete = function(req, res) {
  var billGame = req.billGame;
  billGame.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billGame);
    }
  });
};

/**
 * List of billGame
 */
exports.list = function(req, res) {
  req.db.Billgame.find().sort('-created').exec(function(err, billGames) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billGames, opts, function (err, billGames) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(billGames);
        }
      });
    }
  });
};

/**
 * billGame middleware
 */
exports.billGameByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill Game is invalid'
    });
  }

  req.db.Billgame.findById(id).exec(function (err, billGame) {
    if (err) {
      return next(err);
    } else if (!billGame) {
      return res.status(404).send({
        message: 'No Bill Game with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(billGame, opts, function (err, billGame) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.billGame = billGame;
          next();
        }
      });
    }
  });
};
