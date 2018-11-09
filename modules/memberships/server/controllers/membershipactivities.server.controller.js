'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  // Membershipactivity = mongoose.model('Membershipactivity'),
  // Customer = mongoose.model('Customer'),
  _ = require('lodash');

/**
 * Create a Membershipactivity
 */
exports.create = function(req, res) {
	// console.log(req.body);

  var membershipactivity = new req.db.Membershipactivities(req.body);
  membershipactivity.user = req.user;

  console.log(membershipactivity);

  membershipactivity.save(function(err) {
    if (err) {
    // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(membershipactivity);
    }
  });
};

/**
 * Show the current membershipactivity
 */
exports.read = function(req, res) {
  res.json(req.membershipactivity);
};

/**
 * Update a membershipactivity
 */
/* exports.update = function(req, res) {

	var membershipactivity = req.membershipactivity;

	membershipactivity = _.extend(membershipactivity, req.body);

	membershipactivity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(membershipactivity);
		}
	});
}; */

/**
 * Delete an membershipactivity
 */
/* exports.delete = function(req, res) {
	var membershipactivity = req.membershipactivity;

	membershipactivity.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(membershipactivity);
		}
	});
}; */

/**
 * List of membershipactivity
 */

exports.list = function(req, res) {
 // console.log(req.query);
 // console.log(req.query.customer);
  if (req.query.searchText) {
    req.db.Customer.find({ companyName: { $regex: req.query.searchText, $options: '$i' } }, { _id: 1 }).exec(function(err, customerIds) {
      if (err) {
        //  console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var arr = [];
        for (var i in customerIds) {
          if (customerIds.hasOwnProperty(i)) {
            arr.push(customerIds[i]._id);
          }
        }
        // console.log(customerIds);
        // console.log(arr);
        // res.json(customerIds);
        // if (req.query.customerIds) {
        req.db.Membershipactivities.find({ customer: { $in: arr } }).sort('-created').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, membershipactivities) {
          if (err) {
            // console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var opts1 = {
              model: 'User',
              path: 'user'
            };
            User.populate(membershipactivities, opts1, function (err, membershipactivities) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // console.log(membershipactivities);
                res.json(membershipactivities);
              }
            });
          }
        });
      }
    });
  } else if (req.query.memberships) {
  // console.log(req.query.memberships);
  // console.log('test');
  /* var arry =[];
  for(var i in req.query.memberships){
  	arry.push(req.query.memberships[i].customer);
  } */
  // console.log(req.query.memberships);
    req.db.Membershipactivities.find({ customer: { $in: req.query.memberships } }).sort('-created').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, membershipactivities) {
      if (err) {
      // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(membershipactivities, opts1, function (err, membershipactivities) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            // console.log(membershipactivities);
            res.json(membershipactivities);
          }
        });
      }
    });
  } else if (req.query.customerID) {
    req.db.Membershipactivities.find({ customer: req.query.customerID }).sort('-created').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, membershipactivities) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(membershipactivities, opts1, function (err, membershipactivities) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(membershipactivities);
          }
        });
      }
    });
  } else {
    req.db.Membershipactivities.find().sort('-created').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, membershipactivities) {
      if (err) {
          // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var opts1 = {
          model: 'User',
          path: 'user'
        };
        User.populate(membershipactivities, opts1, function (err, membershipactivities) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(membershipactivities);
          }
        });
      }
    });
  }
};

/* exports.list = function(req, res) {
	if (req.query.companyName) {
		Membershipactivity.find({companyName:  req.query.companyName}).sort('-created').populate('user').populate('customer').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, membershipactivities) {
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(membershipactivities);
			}
		});
	}
	else {
			Membershipactivity.find().sort('-created').populate('user').populate('customer').exec(function(err, membershipactivities) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(membershipactivities);
			}
		});
	}
}; */

/* exports.customerids = function(req, res) {
	//console.log(req.query);
    console.log(req.query.searchText);
	if (req.query.searchText) {
			Membershipactivity.find({customer: {$in : req.query.searchText}}).sort('-created').populate('customer').populate('user').skip((req.query.page - 1) * req.query.limit).limit(req.query.limit).exec(function(err, membershipactivities) {

				if (err) {
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {


					Membershipactivity.customerids({customer: {$in : req.query.searchText}}).exec(function(err, membershipactivities_customerids) {
						if (err) {
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							//console.log('there are %d membershipactivities', membershipactivities_customerids);
							res.send({customerids: membershipactivities_customerids});
						}
					});

				}
			});

	}
	else {
		Membershipactivity.customerids().exec(function(err, membershipactivities_customerids) {
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//console.log('there are %d membershipactivities', membershipactivities_customerids);
				res.send({count:membershipactivities_customerids});
			}
		});
	}
}; */


/**
 * Count of membershipactivities
 */
/* exports.count = function(req, res) {
	//console.log(req.query);
	//console.log(req.query.searchText);
	if (req.query.searchText) {
			Customer.find({companyName : {$regex : req.query.searchText,$options : '$i'}},{_id:1}).exec(function(err,customerIds){
				if (err) {
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {

					var arr =[];
					for( var i in customerIds ) {
						arr.push(customerIds[i]._id);
					}

					Membershipactivity.count({customer: {$in : arr}}).exec(function(err, membershipactivities_count) {
						if (err) {
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							//console.log('there are %d membershipactivities', membershipactivities_count);
							res.send({count: membershipactivities_count});
						}
					});

				}
			});

	}
	else {
		Membershipactivity.count().exec(function(err, membershipactivities_count) {
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//console.log('there are %d membershipactivities', membershipactivities_count);
				res.send({count:membershipactivities_count});
			}
		});
	}
}; */

/**
 * membershipactivity middleware
 */
exports.membershipactivityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Membership Activity is invalid'
    });
  }

  req.db.Membershipactivities.findById(id).exec(function (err, membershipactivity) {
    if (err) {
      return next(err);
    } else if (!membershipactivity) {
      return res.status(404).send({
        message: 'No Membership Activity with that identifier has been found'
      });
    } else {
      var opts1 = {
        model: 'User',
        path: 'user'
      };
      User.populate(membershipactivity, opts1, function (err, membershipactivity) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.membershipactivity = membershipactivity;
          next();
        }
      });
    }
  });
};
