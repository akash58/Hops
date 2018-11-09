'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  nodemailer = require('nodemailer'),
  User = mongoose.model('User'),
  Tenant = mongoose.model('Tenant'),
  TenantGroup = mongoose.model('TenantGroup'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/*
* Setting URL
*/
var settingURL = function(res, req, user, token) {
  return new Promise(function(resolve, reject) {
    var httpTransport = 'http://';
    if (config.secure && config.secure.ssl === true) {
      httpTransport = 'https://';
    }
    var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
    res.render(path.resolve('modules/users/server/templates/create-password-email'), {
      name: user.displayName,
      appName: config.app.title,
      url: baseUrl + '/api/auth/new/' + token
    }, function (err, emailHTML) {
      if (err) {
        reject(err);
      }
      // done(err, emailHTML, user);
      resolve({ emailHTML, res, user });
    });
  });
};

var emailLink = function (data) {
  return new Promise(function(resolve, reject) {
    var mailOptions = {
      to: data.user.email,
      from: config.mailer.from,
      subject: 'Verify and Create your Account',
      html: data.emailHTML
    };
    smtpTransport.sendMail(mailOptions, function (err) {
      if (!err) {
        data.res.send({
          message: 'An email has been sent to the provided email with further instructions.'
        });
      } else {
        return data.res.status(400).send({
          message: 'Failure sending email'
        });
      }
    });
  });
};

/*
* Create tenant group
*/
var createTenantGroupAndTenant = function(req, res) {
  // console.log(req.body);
  return new Promise(function(resolve, reject) {
    var tenant = new Tenant({
      tenantName: req.body.companyName
    });
    var tenantGroup = new TenantGroup({
      tenantGroupName: req.body.groupName,
      tenants: [tenant._id]
    });

    tenantGroup.save(function(err) {
      if (err) {
        reject(err);
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        tenant.tenantGroup = tenantGroup._id;
        tenant.save(function(err) {
          if (err) {
            reject(err);
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            resolve(tenant);
          }
        });
      }
    });
  });
};

/*
* Create User
*/
var createUser = function(req, res, tenant) {
  return new Promise(function(resolve, reject) {
    crypto.randomBytes(20, function (err, buffer) {
      var token = buffer.toString('hex');
      // done(err, token);

      // For security measurement we remove the roles from the req.body object
      delete req.body.roles;

      // Init user and add missing fields
      var user = new User(req.body);
      user.provider = 'local';
      user.displayName = user.firstName + ' ' + user.lastName;
      user.roles.push('admin');
      user.tenantGroup = tenant.tenantGroup;
      user.tenants.push(tenant._id);
      // token
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      // Then save the user
      user.save(function (err) {
        if (err) {
          reject(err);
          // return res.status(422).send({
          //   message: errorHandler.getErrorMessage(err)
          // });
        } else {
          // Remove sensitive data before login
          // user.password = undefined;
          // user.salt = undefined;

          // req.login(user, function (err) {
          //   if (err) {
          //     res.status(400).send(err);
          //   } else {
          //     res.json(user);
          //   }
          // });
          resolve({ user, token });
        }
      });
    });
  });
};
/**
 * Signup
*/
exports.signup = function (req, res) {

  createTenantGroupAndTenant(req, res).then(function(tenant) {
    createUser(req, res, tenant).then(function(passData) {
      // console.log()
      settingURL(res, req, passData.user, passData.token)
        .then(emailLink)
        .catch(function(err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
    }).catch(function(userErr) {
      TenantGroup.remove({ _id: tenant.tenantGroup }, function(tenantGroupErr) {
        if (tenantGroupErr) {
          // console.log(tenantGroupErr);
        } else {
          Tenant.remove({ _id: tenant._id }, function(tenantErr) {
            if (tenantErr) {
              // console.log(tenantErr);
            } else {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(userErr)
              });
            }
          });
        }
      });
    });
  }).catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });


  // // For security measurement we remove the roles from the req.body object
  // delete req.body.roles;

  // // Init user and add missing fields
  // var user = new User(req.body);
  // user.provider = 'local';
  // user.displayName = user.firstName + ' ' + user.lastName;

  // // Then save the user
  // user.save(function (err) {
  //   if (err) {
  //     return res.status(422).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     // Remove sensitive data before login
  //     user.password = undefined;
  //     user.salt = undefined;

  //     req.login(user, function (err) {
  //       if (err) {
  //         res.status(400).send(err);
  //       } else {
  //         res.json(user);
  //       }
  //     });
  //   }
  // });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      // console.log(user);
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          // console.log(req.user);
          // console.log('***************************************');
          // console.log(user);
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to)
      req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info object
  var info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
    info.redirect_to = req.session.redirect_to;

  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // Email intentionally added later to allow defaults (sparse settings) to be applid.
            // Handles case where no email is supplied.
            // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
            user.email = providerUserProfile.email;

            // And save the user
            user.save(function (err) {
              return done(err, user, info);
            });
          });
        } else {
          return done(err, user, info);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, info);
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
