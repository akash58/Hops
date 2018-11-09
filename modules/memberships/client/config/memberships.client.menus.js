/* (function () {
  'use strict';

  angular
    .module('memberships')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // menuService.addMenuItem('topbar', {
    //   title: 'Configuration',
    //   state: 'configuration',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'operations', {
      title: 'Memberships',
      state: 'memberships.create',
      roles: ['*']
    });
  }
}());
 */
