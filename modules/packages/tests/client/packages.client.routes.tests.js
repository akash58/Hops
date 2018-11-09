(function () {
  'use strict';

  describe('Packages Route Tests', function () {
    // Initialize global variables
    var $scope,
      PackagesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PackagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PackagesService = _PackagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('packages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/packages');
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
          PackagesController,
          mockPackage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('packages.view');
          $templateCache.put('modules/packages/client/views/view-package.client.view.html', '');

          // create mock Package
          mockPackage = new PackagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Package Name'
          });

          // Initialize Controller
          PackagesController = $controller('PackagesController as vm', {
            $scope: $scope,
            packageResolve: mockPackage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:packageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.packageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            packageId: 1
          })).toEqual('/packages/1');
        }));

        it('should attach an Package to the controller scope', function () {
          expect($scope.vm.package._id).toBe(mockPackage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/packages/client/views/view-package.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PackagesController,
          mockPackage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('packages.create');
          $templateCache.put('modules/packages/client/views/form-package.client.view.html', '');

          // create mock Package
          mockPackage = new PackagesService();

          // Initialize Controller
          PackagesController = $controller('PackagesController as vm', {
            $scope: $scope,
            packageResolve: mockPackage
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.packageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/packages/create');
        }));

        it('should attach an Package to the controller scope', function () {
          expect($scope.vm.package._id).toBe(mockPackage._id);
          expect($scope.vm.package._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/packages/client/views/form-package.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PackagesController,
          mockPackage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('packages.edit');
          $templateCache.put('modules/packages/client/views/form-package.client.view.html', '');

          // create mock Package
          mockPackage = new PackagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Package Name'
          });

          // Initialize Controller
          PackagesController = $controller('PackagesController as vm', {
            $scope: $scope,
            packageResolve: mockPackage
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:packageId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.packageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            packageId: 1
          })).toEqual('/packages/1/edit');
        }));

        it('should attach an Package to the controller scope', function () {
          expect($scope.vm.package._id).toBe(mockPackage._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/packages/client/views/form-package.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
