(function () {
  'use strict';

  describe('Stockaudits Route Tests', function () {
    // Initialize global variables
    var $scope,
      StockauditsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StockauditsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StockauditsService = _StockauditsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('stockaudits');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/stockaudits');
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
          StockauditsController,
          mockStockaudit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('stockaudits.view');
          $templateCache.put('modules/stockaudits/client/views/view-stockaudit.client.view.html', '');

          // create mock Stockaudit
          mockStockaudit = new StockauditsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stockaudit Name'
          });

          // Initialize Controller
          StockauditsController = $controller('StockauditsController as vm', {
            $scope: $scope,
            stockauditResolve: mockStockaudit
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:stockauditId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.stockauditResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            stockauditId: 1
          })).toEqual('/stockaudits/1');
        }));

        it('should attach an Stockaudit to the controller scope', function () {
          expect($scope.vm.stockaudit._id).toBe(mockStockaudit._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/stockaudits/client/views/view-stockaudit.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StockauditsController,
          mockStockaudit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('stockaudits.create');
          $templateCache.put('modules/stockaudits/client/views/form-stockaudit.client.view.html', '');

          // create mock Stockaudit
          mockStockaudit = new StockauditsService();

          // Initialize Controller
          StockauditsController = $controller('StockauditsController as vm', {
            $scope: $scope,
            stockauditResolve: mockStockaudit
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.stockauditResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/stockaudits/create');
        }));

        it('should attach an Stockaudit to the controller scope', function () {
          expect($scope.vm.stockaudit._id).toBe(mockStockaudit._id);
          expect($scope.vm.stockaudit._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/stockaudits/client/views/form-stockaudit.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StockauditsController,
          mockStockaudit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('stockaudits.edit');
          $templateCache.put('modules/stockaudits/client/views/form-stockaudit.client.view.html', '');

          // create mock Stockaudit
          mockStockaudit = new StockauditsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stockaudit Name'
          });

          // Initialize Controller
          StockauditsController = $controller('StockauditsController as vm', {
            $scope: $scope,
            stockauditResolve: mockStockaudit
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:stockauditId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.stockauditResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            stockauditId: 1
          })).toEqual('/stockaudits/1/edit');
        }));

        it('should attach an Stockaudit to the controller scope', function () {
          expect($scope.vm.stockaudit._id).toBe(mockStockaudit._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/stockaudits/client/views/form-stockaudit.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
