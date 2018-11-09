(function () {
  'use strict';

  describe('Units Route Tests', function () {
    // Initialize global variables
    var $scope,
      UnitsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UnitsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UnitsService = _UnitsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('units');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/units');
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
          UnitsController,
          mockUnit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('units.view');
          $templateCache.put('modules/units/client/views/view-unit.client.view.html', '');

          // create mock Unit
          mockUnit = new UnitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Unit Name'
          });

          // Initialize Controller
          UnitsController = $controller('UnitsController as vm', {
            $scope: $scope,
            unitResolve: mockUnit
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:unitId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.unitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            unitId: 1
          })).toEqual('/units/1');
        }));

        it('should attach an Unit to the controller scope', function () {
          expect($scope.vm.unit._id).toBe(mockUnit._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/units/client/views/view-unit.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UnitsController,
          mockUnit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('units.create');
          $templateCache.put('modules/units/client/views/form-unit.client.view.html', '');

          // create mock Unit
          mockUnit = new UnitsService();

          // Initialize Controller
          UnitsController = $controller('UnitsController as vm', {
            $scope: $scope,
            unitResolve: mockUnit
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.unitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/units/create');
        }));

        it('should attach an Unit to the controller scope', function () {
          expect($scope.vm.unit._id).toBe(mockUnit._id);
          expect($scope.vm.unit._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/units/client/views/form-unit.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UnitsController,
          mockUnit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('units.edit');
          $templateCache.put('modules/units/client/views/form-unit.client.view.html', '');

          // create mock Unit
          mockUnit = new UnitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Unit Name'
          });

          // Initialize Controller
          UnitsController = $controller('UnitsController as vm', {
            $scope: $scope,
            unitResolve: mockUnit
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:unitId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.unitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            unitId: 1
          })).toEqual('/units/1/edit');
        }));

        it('should attach an Unit to the controller scope', function () {
          expect($scope.vm.unit._id).toBe(mockUnit._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/units/client/views/form-unit.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
