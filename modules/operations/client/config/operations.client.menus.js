(function () {
  'use strict';

  angular
    .module('operations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'pageAuthentication'];

  function menuConfig(menuService, pageAuthentication) {

    pageAuthentication.getRoles(['Operations Overview', 'Table Details', 'Bill Details', 'Payments', 'Memberships'])
      // .then(pageAuthentication.getRoles('Games'))
      // .then(pageAuthentication.getRoles('Serials'))
      .then(function(rolesArray) {
        // console.log(rolesArray.length);
        var mergedRoles = [];
        for (var i = 0; i < rolesArray.length; i++) {
          mergedRoles = angular.extend(mergedRoles, rolesArray[i]);
        }

        menuService.addMenuItem('topbar', {
          position: 2,
          title: 'Operations',
          state: 'operations',
          type: 'dropdown',
          roles: mergedRoles
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'operations', {
          title: 'Operations Overview',
          state: 'operations.view',
          roles: rolesArray[0]
        });

        menuService.addSubMenuItem('topbar', 'operations', {
          title: 'Table Details',
          state: 'rentals.details',
          roles: rolesArray[1]
        });

        menuService.addSubMenuItem('topbar', 'operations', {
          title: 'Bill Details',
          state: 'billdetails.create',
          roles: rolesArray[2]
        });

        menuService.addSubMenuItem('topbar', 'operations', {
          title: 'Payments',
          state: 'payments.create',
          roles: rolesArray[3]
        });

        menuService.addSubMenuItem('topbar', 'operations', {
          title: 'Memberships',
          state: 'memberships.create',
          roles: rolesArray[4]
        });
      });
  }
}());
