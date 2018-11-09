'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Package = mongoose.model('Package'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Package
 */
exports.create = function(req, res) {
  var sendPackage = new req.db.Package(req.body);
  sendPackage.user = req.user;

  sendPackage.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sendPackage);
    }
  });
};

exports.addFoodTypeInPackage = function(req, res) {
  var sendFoodTypeInPackage = new req.db.Packagefoodtype(req.body);
  sendFoodTypeInPackage.user = req.user;

  sendFoodTypeInPackage.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sendFoodTypeInPackage);
    }
  });
};

/**
 * Show the current Package
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sendPackage = req.package ? req.package.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sendPackage.isCurrentUserOwner = req.user && sendPackage.user && sendPackage.user._id.toString() === req.user._id.toString();

  res.jsonp(sendPackage);
};

exports.readFoodTypeInPackage = function(req, res) {
  // convert mongoose document to JSON
  var sendFoodTypeInPackage = req.packageFoodType ? req.packageFoodType.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sendFoodTypeInPackage.isCurrentUserOwner = req.user && sendFoodTypeInPackage.user && sendFoodTypeInPackage.user._id.toString() === req.user._id.toString();

  res.jsonp(sendFoodTypeInPackage);
};

/**
 * Update a Package
 */
exports.update = function(req, res) {
  var sendPackage = req.package;

  sendPackage = _.extend(sendPackage, req.body);

  sendPackage.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sendPackage);
    }
  });
};

exports.updateFoodTypeInPackage = function(req, res) {
  var sendFoodTypeInPackage = req.packageFoodType;

  sendFoodTypeInPackage = _.extend(sendFoodTypeInPackage, req.body);

  sendFoodTypeInPackage.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sendFoodTypeInPackage);
    }
  });
};

/**
 * Delete an Package
 */
exports.delete = function(req, res) {
  var sendPackage = req.package;

  sendPackage.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sendPackage);
    }
  });
};

exports.deleteFoodTypeInPackage = function(req, res) {
  var sendFoodTypeInPackage = req.packageFoodType;

  sendFoodTypeInPackage.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sendFoodTypeInPackage);
    }
  });
};

/**
 * List of Packages
 */
exports.list = function(req, res) {
  if (typeof(req.query.page) === 'undefined') req.query.page = 1;
  if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
  if (req.query.searchText) {
    req.db.Package.find({ $and: [{ active: true }, { packageName: { $regex: new RegExp('^' + req.query.searchText.toLowerCase(), 'i') } }] }).sort('-created').populate('category').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, sendPackage) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(sendPackage, opts1, function (err, sendPackage) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(sendPackage);
          }
        });
      }
    });
  } else if (req.query.packageName) {
    req.db.Package.find({ $and: [{ packageName: { $regex: new RegExp('^' + req.query.packageName.toLowerCase(), 'i') } }, { active: true }] }).sort('-created').populate('category').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, sendPackage) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(sendPackage, opts1, function (err, sendPackage) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            // console.log(sendPackage.length);
            res.jsonp(sendPackage);
          }
        });
      }
    });
  } else if (req.query.packageName) {
    req.db.Package.find({ $and: [{ packageName: req.query.packageName }, { active: true }] }).sort('-created').populate('category').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, sendPackage) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(sendPackage, opts1, function (err, sendPackage) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(sendPackage);
          }
        });
      }
    });
  } else {
    req.db.Package.find({ active: true }).sort('-created').populate('category').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, sendPackage) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(sendPackage, opts1, function (err, sendPackage) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(sendPackage);
          }
        });
      }
    });
  }
};

exports.listFoodTypeInPackage = function(req, res) {
  if (req.query.searchFoodtypeInPackage) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Packagefoodtype.find({ package: req.query.searchFoodtypeInPackage }).sort('-created').populate('foodtype').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, sendFoodTypeInPackage) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(sendFoodTypeInPackage, opts1, function (err, sendFoodTypeInPackage) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(sendFoodTypeInPackage);
          }
        });
      }
    });
  } else {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    req.db.Packagefoodtype.find().sort('-created').populate('foodtype').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, sendFoodTypeInPackage) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(sendFoodTypeInPackage, opts1, function (err, sendFoodTypeInPackage) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(sendFoodTypeInPackage);
          }
        });
      }
    });
  }
};

exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  if (req.query.packageName) {
    req.db.Package.count({ $and: [{ active: true }, { packageName: { $regex: new RegExp('^' + req.query.packageName.toLowerCase(), 'i') } }] }).exec(function(err, Packages_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d purchaseorders', Packages_count);
        res.send({ count: Packages_count });
      }
    });
  } else if (req.query.searchText) {
    req.db.Package.count({ $and: [{ packageName: req.query.searchText }, { active: true }] }).sort('-created').exec(function(err, Packages_count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: Packages_count });
      }
    });
  } else {
    req.db.Package.count({ active: true }).exec(function(err, Packages_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d purchaseorders', Packages_count);
        res.send({ count: Packages_count });
      }
    });
  }
};

/**
 * Package middleware
 */
exports.packageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Package is invalid'
    });
  }

  req.db.Package.findById(id).exec(function (err, sendPackage) {
    if (err) {
      return next(err);
    } else if (!sendPackage) {
      return res.status(404).send({
        message: 'No Package with that identifier has been found'
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(sendPackage, opts1, function (err, sendPackage) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.package = sendPackage;
          next();
        }
      });
    }
  });
};

/**
 * foodType middleware
 */
exports.foodTypeInPackageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Package food type is invalid'
    });
  }

  req.db.Packagefoodtype.findById(id).exec(function (err, sendFoodTypeInPackage) {
    if (err) {
      return next(err);
    } else if (!sendFoodTypeInPackage) {
      return res.status(404).send({
        message: 'No Package food type with that identifier has been found'
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(sendFoodTypeInPackage, opts1, function (err, sendFoodTypeInPackage) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.packageFoodType = sendFoodTypeInPackage;
          next();
        }
      });
    }
  });
};
