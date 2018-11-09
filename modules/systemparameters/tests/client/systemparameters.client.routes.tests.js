(function () {
  'use strict';

  describe('Systemparameters Route Tests', function () {
    // Initialize global variables
    var $scope,
      SystemparametersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SystemparametersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SystemparametersService = _SystemparametersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('systemparameters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/systemparameters');
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
          SystemparametersController,
          mockSystemparameter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('systemparameters.view');
          $templateCache.put('modules/systemparameters/client/views/view-systemparameter.client.view.html', '');

          // create mock Systemparameter
          mockSystemparameter = new SystemparametersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Systemparameter Name'
          });

          // Initialize Controller
          SystemparametersController = $controller('SystemparametersController as vm', {
            $scope: $scope,
            systemparameterResolve: mockSystemparameter
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:systemparameterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.systemparameterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            systemparameterId: 1
          })).toEqual('/systemparameters/1');
        }));

        it('should attach an Systemparameter to the controller scope', function () {
          expect($scope.vm.systemparameter._id).toBe(mockSystemparameter._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/systemparameters/client/views/view-systemparameter.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SystemparametersController,
          mockSystemparameter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('systemparameters.create');
          $templateCache.put('modules/systemparameters/client/views/form-systemparameter.client.view.html', '');

          // create mock Systemparameter
          mockSystemparameter = new SystemparametersService();

          // Initialize Controller
          SystemparametersController = $controller('SystemparametersController as vm', {
            $scope: $scope,
            systemparameterResolve: mockSystemparameter
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.systemparameterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/systemparameters/create');
        }));

        it('should attach an Systemparameter to the controller scope', function () {
          expect($scope.vm.systemparameter._id).toBe(mockSystemparameter._id);
          expect($scope.vm.systemparameter._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/systemparameters/client/views/form-systemparameter.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SystemparametersController,
          mockSystemparameter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('systemparameters.edit');
          $templateCache.put('modules/systemparameters/client/views/form-systemparameter.client.view.html', '');

          // create mock Systemparameter
          mockSystemparameter = new SystemparametersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Systemparameter Name'
          });

          // Initialize Controller
          SystemparametersController = $controller('SystemparametersController as vm', {
            $scope: $scope,
            systemparameterResolve: mockSystemparameter
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:systemparameterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.systemparameterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            systemparameterId: 1
          })).toEqual('/systemparameters/1/edit');
        }));

        it('should attach an Systemparameter to the controller scope', function () {
          expect($scope.vm.systemparameter._id).toBe(mockSystemparameter._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/systemparameters/client/views/form-systemparameter.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
