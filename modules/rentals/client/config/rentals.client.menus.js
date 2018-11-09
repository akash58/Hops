/* (function () {
  'use strict';

  angular
    .module('rentals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'operations', {
      title: 'Rentals',
      state: 'rentals.details',
      roles: ['*']
    });
  }
}());
 */
