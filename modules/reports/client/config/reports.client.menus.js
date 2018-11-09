(function () {
  'use strict';

  angular
    .module('reports')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'pageAuthentication'];

  function menuConfig(menuService, pageAuthentication) {

    pageAuthentication.getRoles(['Daily Report', 'Food Orders', 'Billarchive Details'])
      // .then(pageAuthentication.getRoles('Games'))
      // .then(pageAuthentication.getRoles('Serials'))
      .then(function(rolesArray) {
        // console.log(rolesArray.length);
        var mergedRoles = [];
        for (var i = 0; i < rolesArray.length; i++) {
          mergedRoles = angular.extend(mergedRoles, rolesArray[i]);
        }

        menuService.addMenuItem('topbar', {
          position: 4,
          title: 'Reports',
          state: 'reports',
          type: 'dropdown',
          roles: mergedRoles
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'reports', {
          title: 'Total Revenue Reports',
          state: 'reports.totalRevenueReports',
          roles: rolesArray[0]
        });

        menuService.addSubMenuItem('topbar', 'reports', {
          title: 'Food Order Reports',
          state: 'foodorderreport.create',
          roles: rolesArray[1]
        });

        menuService.addSubMenuItem('topbar', 'reports', {
          title: 'Bill Archive Reports',
          state: 'billarchivereports.list',
          roles: rolesArray[2]
        });
      });
  }
}());
