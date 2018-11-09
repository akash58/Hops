  'use strict';

/**
 * Module dependencies.
 */
  var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
  // Food = mongoose.model('Food'),
  // FoodType = mongoose.model('FoodType'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Food
 */
  exports.createFood = function(req, res) {
  // console.log(req.body);
    var food = new req.db.Food(req.body);
    food.user = req.user;

    food.save(function(err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        /* var opts = { model: 'FoodComponent', path: 'foodComponentsInFood.foodcomponent' };
        req.db.Unittype.populate(food, opts, function(err, food) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts = { model: 'Unittype', path: 'foodComponentsInFood.foodcomponent.baseUnit' };
            req.db.Unittype.populate(food, opts, function(err, food) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else { */
        res.jsonp(food);
              /* }
            });
          }
        }); */
      }
    });
  };
  exports.createFoodType = function(req, res) {
    var foodType = new req.db.Foodtype(req.body);
    foodType.user = req.user;

    foodType.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(foodType);
      }
    });
  };

  exports.createFoodComponent = function(req, res) {
    var foodComponent = new req.db.Foodcomponents(req.body);
    foodComponent.user = req.user;

    foodComponent.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(foodComponent);
      }
    });
  };

/**
 * Show the current Food
 */
  exports.read = function(req, res) {
  // convert mongoose document to jsonp
    var food = req.food ? req.food.tojsonp() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    food.isCurrentUserOwner = req.user && food.user && food.user._id.toString() === req.user._id.toString();

    res.jsonp(food);
  };

/**
 * Update a Food
 */
  exports.update = function(req, res) {
    var food = req.food;
    delete req.body.__v;
    food = _.extend(food, req.body);

    food.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts = { model: 'FoodComponent', path: 'foodComponentsInFood.foodcomponent' };
        req.db.Baseunit.populate(food, opts, function(err, food) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts = { model: 'Baseunit', path: 'foodComponentsInFood.foodcomponent.baseUnit' };
            req.db.Baseunit.populate(food, opts, function(err, food) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                var opts = { model: 'Foodtype', path: 'foodtype' };
                req.db.Foodtype.populate(food, opts, function(err, food) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.jsonp(food);
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  exports.updateFoodType = function(req, res) {
    var foodType = req.foodtype;

    foodType = _.extend(foodType, req.body);

    foodType.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(foodType);
      }
    });
  };

  exports.updateFoodComponent = function(req, res) {
    var foodComponent = req.foodComponent;

    foodComponent = _.extend(foodComponent, req.body);

    foodComponent.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(foodComponent);
      }
    });
  };

  exports.listFoodType = function(req, res) {
  // console.log(req.query.foodTypeName);
  // console.log(req.query.limit);
    if (req.query.foodTypeName) {
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Foodtype.find({ $and: [{ active: true }, { foodTypeName: { $regex: new RegExp(req.query.foodTypeName.toLowerCase(), 'i') } }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodTypes) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(foodTypes);
        }
      });
    }
  };

/**
 * Delete an Food
 */
  exports.delete = function(req, res) {
    var food = req.food;

    food.remove(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(food);
      }
    });
  };

  exports.deleteFoodType = function(req, res) {
    var foodType = req.foodtype;

    foodType.remove(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(foodType);
      }
    });
  };

  exports.deleteFoodComponent = function(req, res) {
    var foodComponent = req.foodComponent;

    foodComponent.remove(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(foodComponent);
      }
    });
  };

/**
 * List of Foods
 */
  exports.listFood = function(req, res) {
    if (req.query.foodType) {
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Food.find({ $and: [{ active: true }, { foodtype: req.query.foodType }] }).sort('-created').populate('foodtype').populate('foodComponentsInFood.foodcomponent').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foods) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
        // res.jsonp(foods);
          var opts = { model: 'Unittype', path: 'foodComponentsInFood.foodcomponent.baseUnit' };
          req.db.Unittype.populate(foods, opts, function(err, foods) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              var opts1 = {
                model: 'User',
                path: 'user'
              };
              User.populate(foods, opts1, function (err, foods) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  res.jsonp(foods);
                }
              });
            }
          });
        }
      });
    } else {
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Food.find({ active: true }).sort('-created').populate('foodtype').populate('foodComponentsInFood.foodcomponent').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foods) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
        // res.jsonp(foods);
          var opts = { model: 'Unittype', path: 'foodComponentsInFood.foodcomponent.baseUnit' };
          req.db.Unittype.populate(foods, opts, function(err, foods) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              var opts1 = {
                model: 'User',
                path: 'user'
              };
              User.populate(foods, opts1, function (err, foods) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  res.jsonp(foods);
                }
              });
            }
          });
        }
      });
    }
  };

  exports.listFoodType = function(req, res) {
  // console.log(req.query.foodTypeName);
  // console.log(req.query.limit);
    if (req.query.foodTypeName) {
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Foodtype.find({ $and: [{ active: true }, { foodTypeName: { $regex: new RegExp(req.query.foodTypeName.toLowerCase(), 'i') } }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodTypes) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(foodTypes, opts1, function (err, foodTypes) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(foodTypes);
            }
          });
        }
      });
    } else {
    // console.log(req.query.page);
    // console.log(req.query.limit);
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Foodtype.find({ active: true }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodTypes) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(foodTypes, opts1, function (err, foodTypes) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(foodTypes);
            }
          });
        }
      });
    }
  };

  exports.listFoodComponent = function(req, res) {
    if (req.query.foodComponentName) {
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Foodcomponents.find({ $and: [{ active: true }, { foodComponentName: { $regex: new RegExp('^' + req.query.foodComponentName.toLowerCase(), 'i') } }] }).sort('-created').populate('baseUnit').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodComponent) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(foodComponent, opts1, function (err, foodComponent) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(foodComponent);
            }
          });
        }
      });
    } else if (req.query.foodcomponentId) {
    // console.log('caled1');
    // console.log(typeof req.query.foodcomponentId);
    // console.log(req.query.foodcomponentId);
      req.db.Foodcomponents.findOne({ _id: req.query.foodcomponentId }).sort('-created').populate('baseUnit').exec(function(err, foodComponent) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(foodComponent, opts1, function (err, foodComponent) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(foodComponent);
            }
          });
        }
      });

    } else if (req.query.foodComponent) {
      req.db.Foodcomponents.find({ $and: [{ active: true }, { foodComponent: { $regex: new RegExp('^' + req.query.foodComponent.toLowerCase(), 'i') } }] }).sort('-created').populate('baseUnit').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodComponent) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(foodComponent, opts1, function (err, foodComponent) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(foodComponent);
            }
          });
        }
      });
    } else {
      if (typeof(req.query.page) === 'undefined') req.query.page = 1;
      if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
      req.db.Foodcomponents.find({ active: true }).sort('-created').populate('baseUnit').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodComponent) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var opts1 = {
            model: 'User',
            path: 'user'
          };
          User.populate(foodComponent, opts1, function (err, foodComponent) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(foodComponent);
            }
          });
        }
      });
    }
  };

/**
 * Food middleware
 */

  exports.countForFood = function(req, res) {
    req.db.Food.count({ $and: [{ active: true }, { foodtype: req.query.foodType }] }).sort('-created').populate('foodtype').populate('foodComponentsInFood.foodcomponent').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function(err, foodCount) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send({ count: foodCount });
      }
    });
  };

  exports.countForFoodType = function(req, res) {
  // console.log(req.query.foodTypeName);
    if (req.query.foodTypeName) {
      req.db.Foodtype.count({ $and: [{ active: true }, { foodTypeName: { $regex: new RegExp(req.query.foodTypeName.toLowerCase(), 'i') } }] }).exec(function(err, foodTypeCount) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.send({ count: foodTypeCount });
        }
      });
    } else {
      req.db.Foodtype.count({ active: true }).exec(function(err, foodTypeCount) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.send({ count: foodTypeCount });
        }
      });
    }
  };

  exports.count = function(req, res) {
    if (req.query.foodComponentName) {
      req.db.Foodcomponents.count({ $and: [{ active: true }, { foodComponentName: { $regex: new RegExp('^' + req.query.foodComponentName.toLowerCase(), 'i') } }] }).exec(function(err, foodComponent_count) {
        if (err) {
          // console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // console.log('there are %d purchaseorders', foodComponent_count);
          res.send({ count: foodComponent_count });
        }
      });
    } else if (req.query.foodcomponentId) {
      req.db.Foodcomponents.count({ $and: [{ foodComponentName: req.query.foodcomponentId }, { active: true }] }).sort('-created').exec(function(err, foodComponent_count) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.send({ count: foodComponent_count });
        }
      });
    } else {
      req.db.Foodcomponents.count({ active: true }).exec(function(err, foodComponent_count) {
        if (err) {
          // console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // console.log('there are %d purchaseorders', foodComponent_count);
          res.send({ count: foodComponent_count });
        }
      });
    }
  };

/**
  * foodType middleware
 */

  exports.foodByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Food is invalid'
      });
    }

    req.db.Food.findById(id).exec(function (err, food) {
      if (err) {
        return next(err);
      } else if (!food) {
        return res.status(404).send({
          message: 'No Food with that identifier has been found'
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(food, opts1, function (err, food) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.food = food;
            next();
          }
        });
      }
    });
  };


  exports.foodTypeByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Food Type is invalid'
      });
    }
    req.db.Foodtype.findById(id).exec(function (err, FoodType) {
      if (err) {
        return next(err);
      } else if (!FoodType) {
        return res.status(404).send({
          message: 'No Food Type with that identifier has been found'
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(FoodType, opts1, function (err, FoodType) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.foodtype = FoodType;
            next();
          }
        });
      }
    });
  };

  exports.FoodcomponentByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Food Component is invalid'
      });
    }

    req.db.Foodcomponents.findById(id).exec(function (err, FoodComponent) {
      if (err) {
        return next(err);
      } else if (!FoodComponent) {
        return res.status(404).send({
          message: 'No Food Component with that identifier has been found'
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(FoodComponent, opts1, function (err, FoodComponent) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.foodComponent = FoodComponent;
            next();
          }
        });
      }
    });
  // };
  };
