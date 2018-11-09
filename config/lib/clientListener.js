'use strict';

var config = require('../config');
// var User = require('mongoose').model('User');
var mongoose = require('mongoose');

// var User = mongoose.model('User');
// var basedomain = config.baseDomain;
// var allowedSubs = { 'admin': true, 'www': true };
// allowedSubs[basedomain] = true;

// console.dir(allowedSubs);

var User = require('../../modules/users/server/models-common/user.server.model');
/* var registerUser = require('../../modules/users/server/models/user2.server.model');
var dburl = config.db.baseUri + '/common-db-for-all-users';
var common = mongoose.createConnection(dburl);
var User = registerUser(common);
 */

function clientListener () {
  return function (req, res, next) {
    // console.log(req.session);
    if (req.session) {
    // check if tenant has already been recognized
      if (req.session.tenant) {
        // console.log('did not search database for ' + req.user.firstName + ' ' + req.user.lastName);
        return next();
      } else {
      // look for tenant in database
        // console.log(req.session);
        if (req.session.passport) {
          if (req.session.passport.user) {
            // console.log(req.session.passport.user);
            // req.session.tenant = 'BOM';
            // console.log('need model');
            // return next();
            User.findOne({ _id: req.session.passport.user }, function (err, user) {
              if (!err) {
                // if user not found
                if (!user) {
                  // res.send(client);
                  res.status(403).send('Sorry! you cant see that.');
                  // console.log(client);
                } else {
                  // client found, create tenant and add client
                  // var opts = { model: 'Tenant', path: 'tenantId' };
                  // User.populate(user, opts, function(err, user) {
                  //   if (err) {
                  //     res.status(403).send('Sorry! No Tenant DB found.');
                  //   } else {
                  //     req.session.tenant = user.tenantId._id;
                  //     return next();
                  //   }
                  // });
                  // console.log(user.tenants[0]);
                  req.session.tenant = user.tenants[0];
                  return next();
                }
              } else {
                // console.log(err);
                res.status(400).send('Sorry! Err in user db : ' + err);
                // return next(err);
              }
            });
          } else return next();
        } else return next();
      }
    } else return next();
  };
}

module.exports = clientListener;
