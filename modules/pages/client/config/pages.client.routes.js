(function () {
  'use strict';

  angular
    .module('pages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pages', {
        abstract: true,
        url: '/pages',
        template: '<ui-view/>'
      })
      .state('pages.list', {
        url: '',
        templateUrl: '/modules/pages/client/views/pages.client.view.html',
        controller: 'PagesController',
        // controllerAs: 'vm',
        data: {
          pageTitle: 'Pages'
        }
      });

  }

  getPage.$inject = ['$stateParams', 'PagesService'];

  function getPage($stateParams, PagesService) {
    return PagesService.get({
      pageId: $stateParams.pageId
    }).$promise;
  }

  newPage.$inject = ['PagesService'];

  function newPage(PagesService) {
    return new PagesService();
  }

}());
