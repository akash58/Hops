(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'pageAuthentication'];

  function menuConfig(menuService, pageAuthentication) {
    pageAuthentication.getRoles(['Page Management', 'Roles', 'Users Management'])
      .then(function (rolesArray) {
        // console.log(rolesArray);
        var mergedRoles = [];
        for (var i = 0; i < rolesArray.length; i++) {
          mergedRoles = angular.extend(mergedRoles, rolesArray[i]);
          mergedRoles.push('admin');
        }
        menuService.addMenuItem('topbar', {
          position: 7,
          title: 'Admin',
          state: 'admin',
          type: 'dropdown',
          roles: mergedRoles
        });
        menuService.addSubMenuItem('topbar', 'admin', {
          title: 'Page Managements', // Page Management
          state: 'pages.list',
          roles: rolesArray[0]
        });
        menuService.addSubMenuItem('topbar', 'admin', {
          title: 'Roles', // Roles
          state: 'roles.list',
          roles: rolesArray[1]
        });
        menuService.addSubMenuItem('topbar', 'admin', {
          title: 'Manage Users', // Users Management
          state: 'admin.users',
          roles: rolesArray[2]
        });
     // Only Admin role is allowed create a new Company
        menuService.addSubMenuItem('topbar', 'admin', {
          title: 'Create Company',
          state: 'admin.createCompany',
          roles: ['admin']
        });
      });
  }
}());
