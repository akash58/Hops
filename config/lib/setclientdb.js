'use strict';

var tenant;
var dburl;
var tenantname;
var activedb;

var PromiseB = require('bluebird');
PromiseB.promisifyAll(require('mongoose'));
var mongoose = require('mongoose');
var config = require('../config');


function setclientdb() {
  return function (req, res, next) {
    // check if client is not valid
    if (typeof(req.session.tenant) === 'undefined') {
      delete req.session.tenant;
      tenant = false;
      return next();
    } else if (typeof(global.tenants) === 'undefined' || typeof(global.tenantdbconns) === 'undefined') {
    // if client already has an existing connection make it active
      global.tenants = [];
      global.tenantdbconns = [];
    }

    if (global.tenants.indexOf(req.session.tenant) > -1) {
      var tempTenantIndex;
      for (var i = 0; i < global.tenantdbconns.length; i++) {
        // var tempTenant = global.tenantdbconns[i].indexOf(req.session.tenant);
        if (global.tenantdbconns[i].name === req.session.tenant) {
          tempTenantIndex = i;
        }
      }
      // console.log(global.tenantdbconns[tempTenantIndex]);
      global.activdb = global.tenantdbconns[tempTenantIndex]; // global.tenantdbconns is an array of or established connections
      // console.log(global.activdb);
      // console.log('did not make new connection for ' + req.session.tenant);
      return next();
    } else {
    // make new db connection
      // console.log('setting db for tenant ' + req.session.tenant);
      dburl = config.db.baseUri + '/' + req.session.tenant + config.db.uriOptions;
      // console.log(dburl);
      tenant = mongoose.createConnection(dburl
      // , dbconfigoptions
      );
      // console.log('tenant :');
      // console.log(tenant);
      tenant.on('connected', function () {
        // console.log('Mongoose default connection open to  ' + req.session.tenant);
        // var tempGlobalTenantDbConn = global.tenantdbconns.indexOf(req.session.tenant);

        /* var tempTenantIdx;
        for(var i=0 ; i < global.tenantdbconns.length ;i++){
          // var tempTenant = global.tenantdbconns[i].indexOf(req.session.tenant);
          if(global.tenantdbconns[i].name === req.session.tenant){
            tempTenantIdx = i;
          }
        } */

        // If pool has not been created, create it and Add new connection to the pool and set it as active connection
        if (typeof(global.tenants[req.session.tenant]) === 'undefined' || typeof(global.tenantdbconns[req.session.tenant]) === 'undefined') {
          // var tempGlobalTenant = global.tenants.indexOf(req.session.tenant);
          tenantname = req.session.tenant;
          global.tenants.push(req.session.tenant);// Store name of tenant in the global tenants array
          var tempTenantName = global.tenants.indexOf(tenantname);
          activedb = global.tenantdbconns[tempTenantName] = tenant; // Store connection in the global connection array and set it as the current active database
          // console.log('I am now in the list of active tenants  ' + global.tenants[tempTenantName]);
          global.activdb = activedb;
          // console.log('tenant connection established, and saved for ' + req.session.tenant);
          return next();
        }
      });
      // When the connection is disconnected
      tenant.on('disconnected', function () {
        // console.log('Mongoose ' + req.session.tenant + ' connection disconnected');
      });

      // If the Node process ends, close the Mongoose connection
      process.on('SIGINT', function () {
        tenant.close(function () {
          // console.log(req.session.tenant + ' connection disconnected through app termination');
          process.exit(0);
        });
      });
    }
    // var DEBUG = false;
    // ENABLE/DISABLE Console Logs
    /* if(DEBUG){
      console.log = function() {};
    } */
  };
}

module.exports = setclientdb;
