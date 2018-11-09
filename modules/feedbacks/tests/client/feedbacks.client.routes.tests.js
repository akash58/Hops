(function () {
  'use strict';

  describe('Feedbacks Route Tests', function () {
    // Initialize global variables
    var $scope,
      FeedbacksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FeedbacksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FeedbacksService = _FeedbacksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('feedbacks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/feedbacks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FeedbacksController,
          mockFeedback;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('feedbacks.view');
          $templateCache.put('modules/feedbacks/client/views/view-feedback.client.view.html', '');

          // create mock Feedback
          mockFeedback = new FeedbacksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Feedback Name'
          });

          // Initialize Controller
          FeedbacksController = $controller('FeedbacksController as vm', {
            $scope: $scope,
            feedbackResolve: mockFeedback
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:feedbackId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.feedbackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            feedbackId: 1
          })).toEqual('/feedbacks/1');
        }));

        it('should attach an Feedback to the controller scope', function () {
          expect($scope.vm.feedback._id).toBe(mockFeedback._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/feedbacks/client/views/view-feedback.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FeedbacksController,
          mockFeedback;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('feedbacks.create');
          $templateCache.put('modules/feedbacks/client/views/form-feedback.client.view.html', '');

          // create mock Feedback
          mockFeedback = new FeedbacksService();

          // Initialize Controller
          FeedbacksController = $controller('FeedbacksController as vm', {
            $scope: $scope,
            feedbackResolve: mockFeedback
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.feedbackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/feedbacks/create');
        }));

        it('should attach an Feedback to the controller scope', function () {
          expect($scope.vm.feedback._id).toBe(mockFeedback._id);
          expect($scope.vm.feedback._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/feedbacks/client/views/form-feedback.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FeedbacksController,
          mockFeedback;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('feedbacks.edit');
          $templateCache.put('modules/feedbacks/client/views/form-feedback.client.view.html', '');

          // create mock Feedback
          mockFeedback = new FeedbacksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Feedback Name'
          });

          // Initialize Controller
          FeedbacksController = $controller('FeedbacksController as vm', {
            $scope: $scope,
            feedbackResolve: mockFeedback
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:feedbackId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.feedbackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            feedbackId: 1
          })).toEqual('/feedbacks/1/edit');
        }));

        it('should attach an Feedback to the controller scope', function () {
          expect($scope.vm.feedback._id).toBe(mockFeedback._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/feedbacks/client/views/form-feedback.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
