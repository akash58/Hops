'use strict';

/**
 * Module dependencies.
 */
var billpackageorderarchives = require('../controllers/billpackageorderarchives.server.controller');

module.exports = function(app) {
  // Bill Package orderarchives Routes
  app.route('/api/billpackageorderarchives')
    .get(billpackageorderarchives.list)
    .post(billpackageorderarchives.create);

  app.route('/api/billpackageorderarchives/:billpackageorderarchiveId')
    .get(billpackageorderarchives.read);
    // .put(users.requiresLogin, billpackageorderarchives.update);

  // Finish by binding the Bill Packageorderarchive middleware
  app.param('billpackageorderarchiveId', billpackageorderarchives.billpackageorderarchiveByID);
};
