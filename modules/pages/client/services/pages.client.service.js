// Roles service used to communicate Roles REST endpoints
(function () {
  'use strict';

  angular
    .module('pages')
    .factory('PagesService', PagesService);

  PagesService.$inject = ['$resource'];

  function PagesService($resource) {
    return $resource('/api/pages/:pageId', {
      pageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
