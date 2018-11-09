'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Systemparameters Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/systemparameters',
      permissions: '*'
    }, {
      resources: '/api/systemparameters/:systemparameterId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/systemparameters',
      permissions: ['get', 'post']
    }, {
      resources: '/api/systemparameters/:systemparameterId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/systemparameters',
      permissions: ['get']
    }, {
      resources: '/api/systemparameters/:systemparameterId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Systemparameters Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Systemparameter is being processed and the current user created it then allow any manipulation
  if (req.systemparameter && req.user && req.systemparameter.user && req.systemparameter.user.id === req.user.id) {
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
