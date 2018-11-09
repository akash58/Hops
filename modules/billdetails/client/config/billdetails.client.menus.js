/* (function () {
  'use strict';

  angular
    .module('billdetails')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'configuration', {
      title: 'Bill Details',
      state: 'billdetails.create',
      roles: ['user']
    });
  }
}());
*/
