/* (function () {
  'use strict';

  angular
    .module('payments')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'operations', {
      title: 'Payments',
      state: 'payments.create',
      roles: ['*']
    });
  }
}());
 */
