(function () {
  'use strict';

  angular
    .module('attendants')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'pageAuthentication'];

  function menuConfig(menuService, pageAuthentication) {

    pageAuthentication.getRoles(['Users Management', 'Categories', 'Customers', 'Foods', 'Food Components', 'Packages', 'Payment Modes', 'Suppliers', 'System Parameters', 'Tables', 'Units'])
      .then(function (rolesArray) {
        // console.log(rolesArray);
        var mergedRoles = [];
        for (var i = 0; i < rolesArray.length; i++) {
          mergedRoles = angular.extend(mergedRoles, rolesArray[i]);
        }
        menuService.addMenuItem('topbar', {
          position: 6,
          title: 'Configuration',
          state: 'configuration',
          type: 'dropdown',
          roles: mergedRoles
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Attendants',
          state: 'attendants.create',
          roles: rolesArray[0]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Categories',
          state: 'categories.create',
          roles: rolesArray[1]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Customers',
          state: 'customers.create',
          roles: rolesArray[2]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Foods',
          state: 'foods.create',
          roles: rolesArray[3]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Food Components',
          state: 'foods.component',
          roles: rolesArray[4]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Packages',
          state: 'packages.create',
          roles: rolesArray[5]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Payment Modes',
          state: 'paymentmodetypes.create',
          roles: rolesArray[6]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Suppliers',
          state: 'suppliers.create',
          roles: rolesArray[7]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'System Parameters',
          state: 'systemparameters.create',
          roles: rolesArray[8]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Tables',
          state: 'tables.create',
          roles: rolesArray[9]
        });
        menuService.addSubMenuItem('topbar', 'configuration', {
          title: 'Units',
          state: 'unitType.list',
          roles: rolesArray[10]
        });
      });
  }
}());
