'use strict';

var path = require('path');
var config = require('../config');
// var registerAssociate = require('../../modules/associates/server/models/associate.server.model');
// var registerClientGroup = require('../../modules/clients/server/models/clientGroup.server.model');

// Globbing model files

config.utils.getGlobbedPaths(config.files.server.models).forEach(function (modelPath) {
  require(path.resolve(modelPath));

});


function modelsInit() {
  return function (req, res, next) {

    // console.log(req.subdomains[0]);
/*     switch (req.subdomains[0]) {
      case 'www':
      case undefined:
        return next();
        //break;
      case 'admin':
        return next();
        //break;
//      default:
//      return
    } */
    if (req.session.tenant) {
      var tenantname = req.session.tenant;

      if (typeof global.tenantModel === 'undefined') global.tenantModel = {};
      // test if models are not already compiled if so, skip
      if (/* typeof req.db === 'undefined' && */ typeof global.tenantModel[tenantname] === 'undefined') {
        req.db = {};
        // req.db.Associate = registerAssociate(global.activdb);
        // req.db.ClientGroup = registerClientGroup(global.activdb);
        // console.log(config.files.server.models);
        // Get files from models directory
        var nameArray = [];
        /* for(var i=0; i < config.files.server.models.length; i++){
          var modelPath1 = config.files.server.models[i];
          var filename = modelPath2.replace(/^.*[\\\/]/, '');
          var fullname = filename.substr(0, filename.lastIndexOf('.'));
          var endname = fullname.indexOf('.');
          var name = fullname.substr(0, endname);
          var namepath =
        } */
        // console.log(config.files.server.models);
        config.utils.getGlobbedPaths(config.files.server.models).forEach(function (modelPath) {
          // console.log('the filepath is ' + modelPath);
          // Deduce/ extrapulate model names from the file names
          // Im not very good with regxp but this is what i had to do, to get the names from the filename e.g users.server.models.js (this is my naming convention, so as not to get confused with server side models and client side models
          var modelPath2 = '../../' + modelPath;

          var filename = modelPath2.replace(/^.*[\\\/]/, '');
          var fullname = filename.substr(0, filename.lastIndexOf('.'));
          var endname = fullname.indexOf('.');
          var name = fullname.substr(0, endname);
          name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
          });
          // console.log('new file path : ' + modelPath2);
          var registerModel = require(modelPath2);
          // console.log(registerModel);
          req.db[name] = registerModel(global.activdb);
          // var register = require(modelPath2);
          // req.db[name] = require(path.resolve(modelPath));
          // req.db.name = register(global.activdb);
          // req.db[name] = global.activdb.base.models.[name].model(require(path.resolve(modelPath)));
          // (global.activdb);
          // req.activdb = global.activdb;
          // console.log('the filename is ' + name);
        });
        // console.log(req.db);

          /* for(){

          } */

        global.tenantModel[tenantname] = req.db;
        return next();
      }
      // since models exist, pass it to request.db for easy consumption in controllers
      req.db = global.tenantModel[tenantname];
      req.activdb = global.activdb;
      return next();
    } else return next();
  };
    // var DEBUG = false;
    // ENABLE/DISABLE Console Logs
    /* if(!DEBUG){
      console.log = function() {};
    } */
}

module.exports = modelsInit;
