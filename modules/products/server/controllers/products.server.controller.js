'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Product = mongoose.model('Product'),
  // Specdesc = mongoose.model('Specdesc'),
  // Specvalue = mongoose.model('Specvalue'),
  _ = require('lodash');

/**
 * Create a product
 */
exports.create = function(req, res) {

  var product = new req.db.Product({
    productName: req.body.productName,
    productNumber: req.body.productNumber,
    component: req.body.component,
    category: req.body.category
  });

  product.user = req.user;

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
      req.db.Specdesc.find().where('component').equals(req.body.component).sort('specificationDescription').exec(function(err, specdescs) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // console.log(specdescs);
          // var specvalues = [];

          for (var i = 0, l = specdescs.length; i < l; i++) {
            var specvalue = new req.db.Specvalue({
              product: product._id
            });
            // specvalues.push(specvalue);
            // specvalues[i].specdesc = specdescs[i]._id;
            specvalue.specdesc = specdescs[i]._id;
            // specvalues[i].user = req.user;
            specvalue.user = req.user;
            // saveSpecvalue(specvalues[i]);
            // var sepcvalue = specvalues[i];
            exports.createSpecValue(specvalue);
            // specvalues[i].save();
            // res.json(specvalue[i]);
          }
        // console.log(specdescs);
        }
      });
    }
  });
};


exports.createSpecValue = function(specvalue, res) {
  specvalue.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    // console.log(specvalue);
  });
};


/**
 * Show the current product
 */
exports.read = function(req, res) {
  res.json(req.product);
};

/**
 * Update a product
 */
exports.update = function(req, res) {
  // console.log(req.body);

  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete an product
 */
exports.delete = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * List of product
 */
// exports.list = function(req, res) {
//  Product.find().sort('-created').exec(function(err, products) {
//    if (err) {
//      return res.status(400).send({
//        message: errorHandler.getErrorMessage(err)
//      });
//    } else {
//      res.json(products);
//      //console.log(products);
//    }
//  });
// };

exports.list = function(req, res) {
  req.query.limit = Number(req.query.limit) || 10;
  req.query.page = Number(req.query.page) || 1;
  if (req.query.productNumber) {
    req.db.Product.find({ active: true, productNumber: { $regex: new RegExp('^' + req.query.productNumber.toLowerCase(), 'i') } }).sort('-created').populate('components').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, products) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(products, opts1, function (err, products) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(products);
          }
        });
      }
    });
  } else if (req.query.component) {
    // console.log(req.query.component);console.log('req.query.component');
    // var comp = req.query.component._id;
    req.db.Product.find({ active: true, component: req.query.component }).sort('-created').populate('components').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, products) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(products, opts1, function (err, products) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            // console.log(products); console.log(products.length);
            res.json(products);
          }
        });
      }
    });
  } else {
    req.db.Product.find({ active: true }).sort('-created').populate('components').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, products) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(products, opts1, function (err, products) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(products);
          }
        });
      }
    });
  }
};

/**
 * Count of products
 */
exports.count = function(req, res) {
  // console.log(req.query);
  // console.log(req.query.searchText);
  // console.log(req.query.productNumber);
  req.query.limit = Number(req.query.limit) || 10;
  req.query.page = Number(req.query.page) || 1;
  if (req.query.productNumber && req.query.component) {
    req.db.Product.count({ active: true, component: req.query.component, productNumber: { $regex: new RegExp('^' + req.query.productNumber.toLowerCase(), 'i') } }).exec(function(err, products_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d payments',  products_count);
        res.send({ count: products_count });
      }
    });
  } else if (req.query.productNumber) {
    req.db.Product.count({ active: true, productNumber: { $regex: new RegExp('^' + req.query.productNumber.toLowerCase(), 'i') } }).exec(function(err, products_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d payments',  products_count);
        res.send({ count: products_count });
      }
    });
  } else if (req.query.component) {
    req.db.Product.count({ active: true, component: req.query.component }).exec(function(err, products_count) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d payments', products_count);
        res.send({ count: products_count });
      }
    });
  } else {
    req.db.Product.count({ active: true }).exec(function(err, products_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('there are %d payments',  products_count);
        res.send({ count: products_count });
      }
    });
  }
};
/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'product is invalid'
    });
  }

  req.db.Product.findById(id).exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    } else {
    // console.log(documents);
      var opts = {
        model: 'User',
        path: 'user'
      };
      User.populate(product, opts, function (err, product) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.product = product;
          next();
        }
      });
    }
  });
};
