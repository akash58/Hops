'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Packages Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/packages',
      permissions: '*'
    }, {
      resources: '/api/packages/:packageId',
      permissions: '*'
    }]
  }, {
    roles: ['admin'],
    allows: [{
      resources: '/api/packagefoodtypes',
      permissions: '*'
    }, {
      resources: '/api/packagefoodtypes/:packageFoodTypeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/packages',
      permissions: ['get', 'post']
    }, {
      resources: '/api/packages/:packageId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/packages',
      permissions: ['get']
    }, {
      resources: '/api/packages/:packageId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Packages Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Package is being processed and the current user created it then allow any manipulation
  if (req.package && req.user && req.package.user && req.package.user.id === req.user.id) {
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
