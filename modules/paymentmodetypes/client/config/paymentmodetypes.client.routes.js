(function () {
  'use strict';

  angular
    .module('paymentmodetypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('paymentmodetypes', {
        abstract: true,
        url: '/paymentmodetypes',
        template: '<ui-view/>'
      })
      /* .state('paymentmodetypes.list', {
        url: '',
        templateUrl: '/modules/paymentmodetypes/client/views/list-paymentmodetypes.client.view.html',
        controller: 'BaseunitsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Baseunits List'
        }
      }) */
      .state('paymentmodetypes.create', {
        url: '/create',
        templateUrl: '/modules/paymentmodetypes/client/views/form-paymentmodetype.client.view.html',
        controller: 'PaymentModeTypesController',
        controllerAs: 'vm',
        resolve: {
          paymentmodetypeResolve: newPaymentmodetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Payment mode-type Create'
        }
      })
      .state('paymentmodetypes.edit', {
        url: '/:paymentmodetypeId/edit',
        templateUrl: '/modules/paymentmodetypes/client/views/form-paymentmodetype.client.view.html',
        controller: 'PaymentModeTypesController',
        controllerAs: 'vm',
        resolve: {
          paymentmodetypeResolve: getPaymentmodetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Payment mode type {{ paymentmodetypeResolve.name }}'
        }
      })
      .state('paymentmodetypes.view', {
        url: '/:paymentmodetypeId',
        templateUrl: '/modules/paymentmodetypes/client/views/view-paymentmodetype.client.view.html',
        controller: 'PaymentModeTypesController',
        controllerAs: 'vm',
        resolve: {
          paymentmodetypeResolve: getPaymentmodetype
        },
        data: {
          pageTitle: 'Payment mode-type {{ paymentmodetypeResolve.name }}'
        }
      });
  }

  getPaymentmodetype.$inject = ['$stateParams', 'PaymentmodetypesService'];

  function getPaymentmodetype($stateParams, PaymentmodetypesService) {
    return PaymentmodetypesService.get({
      paymentmodetypeId: $stateParams.baseunitId
    }).$promise;
  }

  newPaymentmodetype.$inject = ['PaymentmodetypesService'];

  function newPaymentmodetype(PaymentmodetypesService) {
    return new PaymentmodetypesService();
  }
}());
