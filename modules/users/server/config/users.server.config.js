'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  TenantGroup = mongoose.model('TenantGroup'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    // User.findOne({
    //   _id: id
    // }, '-salt -password', function (err, user) {
    //   done(err, user);
    // });
    User.findOne({
      _id: id
    }, { salt: 0, password: 0 }).populate('tenants').populate('tenantGroup').exec(function (err, user) {
      // var opt = {
      //   model: 'TenantGroup',
      //   path: 'tenants.tenantGroup'
      // };
      // TenantGroup.populate(user, opt, function(err, document) {
      //   done(err, document);
      // });
      done(err, user);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
