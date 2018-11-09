(function () {
  'use strict';

  angular
    .module('feedbacks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('feedbacks', {
        abstract: true,
        url: '/feedbacks',
        template: '<ui-view/>'
      })
      .state('feedbacks.list', {
        url: '',
        templateUrl: '/modules/feedbacks/client/views/list-feedbacks.client.view.html',
        controller: 'FeedbacksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Feedbacks List'
        }
      })
      .state('feedbacks.create', {
        url: '/create',
        templateUrl: '/modules/feedbacks/client/views/form-feedback.client.view.html',
        controller: 'FeedbacksController',
        controllerAs: 'vm',
        resolve: {
          feedbackResolve: newFeedback
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Feedbacks Create'
        }
      })
      .state('feedbacks.edit', {
        url: '/:feedbackId/edit',
        templateUrl: '/modules/feedbacks/client/views/form-feedback.client.view.html',
        controller: 'FeedbacksController',
        controllerAs: 'vm',
        resolve: {
          feedbackResolve: getFeedback
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Feedback {{ feedbackResolve.name }}'
        }
      })
      .state('feedbacks.view', {
        url: '/:feedbackId',
        templateUrl: '/modules/feedbacks/client/views/view-feedback.client.view.html',
        controller: 'FeedbacksController',
        controllerAs: 'vm',
        resolve: {
          feedbackResolve: getFeedback
        },
        data: {
          pageTitle: 'Feedback {{ feedbackResolve.name }}'
        }
      });
  }

  getFeedback.$inject = ['$stateParams', 'FeedbacksService'];

  function getFeedback($stateParams, FeedbacksService) {
    return FeedbacksService.get({
      feedbackId: $stateParams.feedbackId
    }).$promise;
  }

  newFeedback.$inject = ['FeedbacksService'];

  function newFeedback(FeedbacksService) {
    return new FeedbacksService();
  }
}());
