(function () {
  'use strict';

  describe('Units Controller Tests', function () {
    // Initialize global variables
    var UnitsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      UnitsService,
      mockUnit,
      Notification;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _UnitsService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      // var vm = $scope.vm;

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      UnitsService = _UnitsService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock Part
      mockUnit = new UnitsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Kilograms',
        unitType: '525a8422f6d0f87f0e407a34',
        symbol: 'kg',
        multiplierWithBaseUnit: '1000',
        note: 'testing unit'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Parts controller.
      UnitsController = $controller('UnitsController as vm', {
        $scope: $scope,
        CreatedUnitIn: { _id: '525a8422f6d0f87f0e407a34' }
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.createUnit() is working', function () {

      var sampleUnitPostData,
        vm;

      beforeEach(function () {
        vm = $scope.vm;

        vm.unitName = 'Kilograms';
        vm.symbol = 'kg';
        vm.multiplierWithBaseUnit = '1000';
        vm.note = 'testing unit';
        vm.unitType = UnitsController.unitType;

        vm.unitForm = {
          name: {
            $touched: true,
            $valid: true
          },
          $valid: true,
          $setPristine: function() {}
        };

        // Create a sample Part object
        sampleUnitPostData = new UnitsService({
          name: vm.unitName,
          unitType: vm.unitType._id,
          symbol: vm.symbol,
          multiplierWithBaseUnit: vm.multiplierWithBaseUnit,
          note: vm.note
        });

      });

      it('should send a POST request with the form input values', function () {
        // Set POST response
        $httpBackend.expectPOST('/api/units', sampleUnitPostData).respond(mockUnit);

        // Run controller functionality
        vm.createUnit();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith('Unit ' + sampleUnitPostData.name + ' created successfully');

      });

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/units', sampleUnitPostData).respond(400, {
          message: errorMessage
        });

        vm.createUnit(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('vm.goBackToLIst() is working', function () {

      it('and should redirect to list view', function () {

        // Run controller functionality
        $scope.vm.goBackToList(true);

        // Test URL location to list view
        // expect($state.params).toEqual({ findByunitType: '525a8422f6d0f87f0e407a34' });
        expect($state.go).toHaveBeenCalledWith('unitType.unitList', { findByunitType: '525a8422f6d0f87f0e407a34' });
      });

    });

  });
}());
