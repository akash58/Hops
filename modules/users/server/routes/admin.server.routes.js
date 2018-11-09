'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  app.route('/api/attendants').post(/* adminPolicy.isAllowed, */admin.createEmail);

  app.route('/api/findByToken').get(/* adminPolicy.isAllowed, */admin.findByToken);

  app.route('/api/attendants/createAttendantUser').
  post(/* adminPolicy.isAllowed,*/ admin.createAttendantUser);

  app.route('/api/attendant/verify/:token')
  .get(/* adminPolicy.isAllowed, */admin.validateToken);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);

  app.route('/api/user/createCompany')
    .post(admin.createCompany);
};
