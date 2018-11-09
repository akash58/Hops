/* (function () {
  'use strict';

  angular
    .module('purchaseorders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'operations', {
      title: 'Purchase Orders',
      state: 'purchaseorders.create',
      roles: ['*']
    });
  }
}());
 */
