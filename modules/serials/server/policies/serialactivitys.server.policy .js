'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke serialactivitys Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/serialactivitys',
      permissions: '*'
    }, {
      resources: '/api/serialactivitys/:specvalueId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/serialactivitys',
      permissions: ['get', 'post']
    }, {
      resources: '/api/serialactivitys/:specvalueId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/serialactivitys',
      permissions: ['get']
    }, {
      resources: '/api/serialactivitys/:specvalueId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If serialactivitys Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Bill is being processed and the current user created it then allow any manipulation
  if (req.bill && req.user && req.bill.user && req.bill.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
