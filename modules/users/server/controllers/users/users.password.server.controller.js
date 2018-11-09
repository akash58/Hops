'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  fs = require('fs'),
  request = require('request-promise'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username.toLowerCase()
        }, '-salt -password', function (err, user) {
          if (err || !user) {
            return res.status(400).send({
              message: 'No account with that username has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function (token, user, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: baseUrl + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password GET from email token for new tenant
 *
 */
exports.validateNewAdminPasswordToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/new/' + req.params.token);
  });
};
/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  // console.log('called function');
  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // fs.readFile('config/jsons/systemparameter.json', 'utf8', function(err, systemParameterStringData) {
                    //   if (err) {
                    //     return res.status(422).send({
                    //       message: errorHandler.getErrorMessage(err)
                    //     });
                    //   } else {
                    //     var systemParameterJsonData = JSON.parse(systemParameterStringData);
                    //     // Remove sensitive data before return authenticated user
                    //     user.password = undefined;
                    //     user.salt = undefined;

                    //     res.json(user);
                    //     done(err, user);
                    //   }
                    // });
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);
                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};


/**
 * Create password POST from email token for new tenant
 *
 */
exports.newAdminPasswordAndTenantInitialization = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            // user.resetPasswordToken = undefined;
            // user.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) {
                // console.log('user not saved!!');
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    req.session.tenant = user.tenantId;
                    req.session.passport = { user: user._id };
                    req.session.save();
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    // fs.readFile('config/jsons/systemparameter.json', 'utf8', function (err, systemParameterStringData) {
                    //   // var systemParameters = res;

                    //   // console.log(res);
                    //   var systemParameterJsonData = JSON.parse(systemParameterStringData);
                    //   var options = {
                    //     method: 'POST',
                    //     uri: 'http://localhost:3000/api/systemParameters/insertMany',
                    //     headers: { cookie: req.headers.cookie },
                    //     // JSON.parse(req.headers),
                    //     body: systemParameterJsonData,
                    //     /* {
                    //       systemParameterName: 'Test2',
                    //       defaultValue: '12',
                    //       value: '10',
                    //       description: 'this is a test2'
                    //     }, */
                    //     json: true // Automatically stringifies the body to JSON
                    //   };

                    //   // console.log('request start');

                    //   request(options)
                    //     .then(function (parsedBody) {

                    //       // POST succeeded...
                    //       // console.log(parsedBody);
                    //       // console.log('parsedBody');
                    //       user.password = undefined;
                    //       user.salt = undefined;
                    //       res.json(user);
                    //       // res.json(user);
                    //       // done(err, user);
                    //     }).catch(function (err) {
                    //       return res.status(400).send({
                    //         message: 'User created but issue when adding system parameters and other initilization to this company database.'
                    //       });
                    //       // POST failed...
                    //       // console.log(err);
                    //       // console.log('err');
                    //     }).finally(function() {
                    //       // res.json(user);
                    //       done(err, user);
                    //     });
                    // });
                    var httpTransport = 'http://';
                    if (config.secure && config.secure.ssl === true) {
                      httpTransport = 'https://';
                    }
                    var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
                    var options = {
                      method: 'POST',
                      uri: baseUrl + '/api/auth/seed',
                      headers: { cookie: req.headers.cookie },
                      // JSON.parse(req.headers),
                      body: {},
                      /* {
                        systemParameterName: 'Test2',
                        defaultValue: '12',
                        value: '10',
                        description: 'this is a test2'
                      }, */
                      json: true // Automatically stringifies the body to JSON
                    };

                    // console.log('request start');

                    request(options)
                      .then(function (parsedBody) {

                        // POST succeeded...
                        // console.log(parsedBody);
                        // console.log('parsedBody');
                        user.password = undefined;
                        user.salt = undefined;
                        res.json(user);
                        // res.json(user);
                        // done(err, user);
                      }).catch(function (err) {
                        return res.status(400).send({
                          message: 'User created but issue when adding system parameters and other initilization to this company database.'
                        });
                        // POST failed...
                        // console.log(err);
                        // console.log('err');
                      }).finally(function() {
                        // res.json(user);
                        done(err, user);
                      });
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/users/server/templates/set-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been created',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

var a = function (res, user, successHandler, errHandler) {
  res.render('modules/users/server/templates/reset-password-confirm-email', {
    name: user.displayName,
    appName: config.app.title
  }, function (err, emailHTML) {
    if (err) errHandler(err);
    if (successHandler) successHandler(emailHTML, res, user,
      function(res) {
        res.send({
          message: 'Password changed successfully'
        });
      }, errHandler);
  });
};

var b = function (emailHTML, res, user, successHandler, errHandler) {
  var mailOptions = {
    to: user.email,
    from: config.mailer.from,
    subject: 'Your password has been changed',
    html: emailHTML
  };

  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) errHandler(err);
    if (successHandler) successHandler(res);
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};
