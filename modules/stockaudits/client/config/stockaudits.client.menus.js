/* (function () {
  'use strict';

  angular
    .module('stockaudits')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'operations', {
      title: 'Stock Audits',
      state: 'stockaudits.create',
      roles: ['*']
    });
  }
}());
 */
