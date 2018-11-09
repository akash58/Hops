'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tenant = mongoose.model('Tenant'),
  TenantGroup = mongoose.model('TenantGroup'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto'),
  config = require(path.resolve('./config/config')),
  TempAttendantTokenWithEmail = mongoose.model('TempAttendantTokenWithEmail'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
* create company(tenant) and update tenant group , and also the user tenants field.
*/
var createTenant = function (req, res) {
  return new Promise(function(resolve, reject) {
    // console.log(req.body.companyName);
    var tenant = new Tenant({
      tenantName: req.body.companyName,
      tenantGroup: req.user.tenantGroup._id
    });
    // console.log(tenant);
    tenant.save(function(err) {
      if (err) {
        reject(err);
      } else {
        // console.log(tenant);
        // console.log('**********************************************************');
        resolve(tenant);
      }
    });
  });
};

var updateTenantGroupAndUser = function (req, res, tenant) {
  return new Promise(function(resolve, reject) {
    var tenantGroup = new TenantGroup(req.user.tenantGroup);
    tenantGroup.tenants.push(tenant._id);
    tenantGroup.save(function(err) {
      if (err) {
        reject(err);
      } else {
        var user = new User(req.user);
        user.tenants.push(tenant._id);
        user.save(function(err) {
          if (err) {
            reject(err);
          } else {
            var index = user.tenants.pop();
            // console.log(index);
            // console.log('index');
            // console.log(user);
            user.tenants.push(tenant);
            user.tenantGroup = tenantGroup;
            resolve(user);
          }
        });
      }
    });
  });
};


exports.createCompany = function (req, res) {
  createTenant(req, res)
    .then(function(tenant) {
      updateTenantGroupAndUser(req, res, tenant).then(function(user) {
        res.json(user);
      }).catch(function(error) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(error)
        });
      });
    }).catch(function(tenanterr) {
      // console.log(tenanterr);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(tenanterr)
      });
    });
};

// Email sending Method

var smtpTransport = nodemailer.createTransport(config.mailer.options);

exports.createEmail = function (req, res) {
  // return new Promise(function(resolve, reject) {
  //   crypto.randomBytes(20, function (err, buffer) {
  //     var email = new TempAttendantTokenWithEmail(req.body);
  //     var createdToken = buffer.toString('hex');
  //     email.resetPasswordToken = createdToken;
  //     email.resetPasswordExpires = Date.now() + 3600000;
  //     var user = req.user;
  //     email.tenants = user.tenantGroup.tenants;

  //     email.save(function(err) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         // resolve(email);
  //         emailInfrom(req, res, email).then(function(email) {
  //           console.log(email);
  //           resolve(email);
  //         }).catch(function(err) {// console.log(err);
  //           return res.status(422).send({
  //             message: errorHandler.getErrorMessage(err)
  //           });
  //         });
  //       }
  //     });
  //   });
  // });
  crypto.randomBytes(20, function (err, buffer) {
    var email = new TempAttendantTokenWithEmail(req.body);
    var createdToken = buffer.toString('hex');
    email.resetPasswordToken = createdToken;
    email.resetPasswordExpires = Date.now() + 3600000;
    var user = req.user;
    email.tenants = req.session.tenant;
    email.tenantGroup = user.tenantGroup._id;
    email.save(function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        emailInfrom(req, res, email).then(function(email) {
          res.jsonp(email);
        }).catch(function(err) {// console.log(err);
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
      }
    });
  });
};
/* exports.responsData = function(req, res) {
  createEmail.then(function (success) {
    res.jsonp(success);
  }, function (error) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
}*/
exports.findByToken = function (req, res) {
  TempAttendantTokenWithEmail.findOne({ resetPasswordToken: req.query.token }).sort('-created').exec(function (err, Respons) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(Respons);
  });
};

function emailInfrom (req, res, email) {
  // console.log('new email    ' + email);
  return new Promise(function (resolve, reject) {
    async.waterfall([
      function(done) {
        var httpTransport = 'http://';
        if (config.secure && config.secure.ssl === true) {
          httpTransport = 'https://';
        }
        res.render(path.resolve('modules/users/server/templates/create-attendantprofile-email'), {
          // name: user.displayName,
          appName: config.app.title,
          url: httpTransport + req.headers.host + '/api/attendant/verify/' + email.resetPasswordToken
        }, function (err, emailHTML) {
          done(err, emailHTML, email);
        });
      },

      function (emailHTML, email, done) {
        var mailOptions = {
          to: email.email,
          from: config.mailer.from,
          subject: 'Attendanted Profile',
          html: emailHTML
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          if (err) {
            err = err + 'Failure sending email';
            reject(err);
          } else {
            resolve(email);
          }
          done(err);
        });
      }
    ], function (err) {
      if (err) {
        reject(err);
      }
    });
  });
}

exports.validateToken = function(req, res, email) {
  // console.log('IN EMAIL.....');
  // console.log(email);
  // console.log('IN req.params.token');
  // console.log(req.params.token);
  TempAttendantTokenWithEmail.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, email) {
    // console.log('IN function in function');
    // console.log(email);
    // console.log(!email);
    if (!email) {
      TempAttendantTokenWithEmail.find({ resetPasswordToken: req.params.token }).remove().exec(function(err, data) {
        // console.log(data);
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          return res.redirect('settings/profile/fail');
        }
      });
    } else {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('called');
        // console.log(req.params.token);
        res.redirect('/attendants/verify/' + req.params.token);
      }
    }
  });
};

exports.createAttendantUser = function (req, res) {
  var user = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    roles: ['guest', 'user'],
    tenantGroup: req.body.tenantGroup,
    tenants: req.body.tenants
  });
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.save(function (err) {
    if (err) {
      // console.log('user error');
      // console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // sign in
      req.session.tenant = user.tenants;
      // console.log('start of message - ' +JSON.stringify(req.session));
      console.log(req.session.tenant);
      req.session.passport = { user: user._id };
      req.login(user, function (err) {
        if (err) {
          /* console.log('start of message - ' +JSON.stringify(req.session));
          console.log('error in login - ' + err);*/
          // console.log(errorHandler.getErrorMessage(err));
          res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // req.session.save();

          TempAttendantTokenWithEmail.remove({ email: req.body.email }).exec(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // console.log(user);
              res.json(user);
            }
          });
        }
      });
    }
  });
};
/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  if (req.query.tenant || req.query.search) {
    // console.log(req.session.tenant);
    var findParameter;
    if (req.query.search) {
      findParameter = { tenants: { $in: [req.session.tenant] }, displayName: { $regex: new RegExp('^' + req.query.search.toLowerCase(), 'i') } };
    } else {
      findParameter = { tenants: { $in: [req.session.tenant] } };
    }
    User.find(findParameter, '-salt -password -providerData').sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(users);
    });
  } else {
    User.find({ tenants: { $in: [req.session.tenant] } }, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(users);
    });
  }
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
