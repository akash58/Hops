(function () {
  'use strict';

  angular
    .module('feedbacks')
    .controller('FeedbacksListController', FeedbacksListController);

  FeedbacksListController.$inject = ['FeedbacksService'];

  function FeedbacksListController(FeedbacksService) {
    var vm = this;

    vm.feedbacks = FeedbacksService.query();
  }
}());
