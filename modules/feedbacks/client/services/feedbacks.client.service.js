// Feedbacks service used to communicate Feedbacks REST endpoints
(function () {
  'use strict';

  angular
    .module('feedbacks')
    .factory('FeedbacksService', FeedbacksService);

  FeedbacksService.$inject = ['$resource'];

  function FeedbacksService($resource) {
    return $resource('/api/feedbacks/:feedbackId', {
      feedbackId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
