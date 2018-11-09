'use strict';

(function() {
  // Food Orerations Controller Spec
  describe('foodOperationsController', function() {
    // Initialize global variables
    var foodOperationsController,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
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
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      // Initialize the Articles controller.
      foodOperationsController = $controller('foodOperationsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one food order object fetched from XHR', inject(function(FoodOrders) {
      // Create sample article using the Articles service
      var sampleFoodOrder = new FoodOrders({
        'food': '5638ae3d93b03cc83b4a0283',
        'user': '561df0c78f8fd758130dc534',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee541',
        'customer': '56d983937dcd96382f285043',
        'tableId': '5624df2794b5ece427bb39a9',
        'orderTime': '2016-03-10T12:49:28.973Z',
        'status': 'Ordered',
        'created': '2016-03-10T12:49:28.981Z'
      });
      var pages = [{
        '_id': '561df0f88e4dd82a814e7fc3',
        'pageName': 'Barcodes',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '561df0f88e4dd82a814e7fcb',
        'pageName': 'Bill Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '56504948b3bfaa3dbab23950',
        'pageName': 'Billarchive Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }];

      // Create a sample articles array that includes the new article
      var sampleFoodOrders = [sampleFoodOrder];
      // Set GET response for pages
      /* $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders); */
      $httpBackend.whenGET('pages').respond(pages);
      // Set GET response
      $httpBackend.whenGET('foodorders').respond(sampleFoodOrders);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.foodorders).toEqualData(sampleFoodOrders);
    }));

    it('$scope.find() should create an array with only one food order object based on filter on status being ordered', inject(function(FoodOrders) {
      // Create sample article using the Articles service
      var sampleFoodOrder = new FoodOrders({
        'food': '5638ae3d93b03cc83b4a0283',
        'user': '561df0c78f8fd758130dc534',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee541',
        'customer': '56d983937dcd96382f285043',
        'tableId': '5624df2794b5ece427bb39a9',
        'orderTime': '2016-03-10T12:49:28.973Z',
        'status': 'Ordered'
        // 'created': '2016-03-10T12:49:28.981Z'
      });
      var sampleFoodOrderServed = new FoodOrders({
        'food': '5638ae3d93b03cc83b4a0281',
        'user': '561df0c78f8fd758130dc531',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee542',
        'customer': '56d983937dcd96382f285041',
        'tableId': '5624df2794b5ece427bb39a1',
        'orderTime': '2016-03-10T12:49:28.973Z',
        'status': 'Served'
        // 'created': '2016-03-10T12:49:28.991Z'
      });
      var sampleFoodOrdersWithServed = [sampleFoodOrder, sampleFoodOrderServed];
      var pages = [{
        '_id': '561df0f88e4dd82a814e7fc3',
        'pageName': 'Barcodes',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '561df0f88e4dd82a814e7fcb',
        'pageName': 'Bill Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '56504948b3bfaa3dbab23950',
        'pageName': 'Billarchive Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }];

      // Create a sample articles array that includes the new article
      var sampleFoodOrders = [sampleFoodOrder];
      // Set GET response for pages
      /* $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders); */
      $httpBackend.whenGET('pages').respond(pages);
      // Set GET response
      $httpBackend.whenGET('foodorders').respond(sampleFoodOrdersWithServed);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.foodordersLength).toEqualData(sampleFoodOrders);
    }));

    it('$scope.makeFoodOrderServed() should create an array with only one food order object after served is clicked', inject(function(FoodOrders) {
      // Create sample article using the Articles service
      var sampleFoodOrder = new FoodOrders({
        '_id': '5638ae3d93b03cc83b4a0213',
        'food': '5638ae3d93b03cc83b4a0283',
        'user': '561df0c78f8fd758130dc534',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee541',
        'customer': '56d983937dcd96382f285043',
        'tableId': '5624df2794b5ece427bb39a9',
        'orderTime': '2016-03-10T12:49:28.973Z',
        'status': 'Ordered'
        // 'created': '2016-03-10T12:49:28.981Z'
      });
      var sampleFoodOrder2 = new FoodOrders({
        'food': '5638ae3d93b03cc83b4a0282',
        'user': '561df0c78f8fd758130dc532',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee543',
        'customer': '56d983937dcd96382f285042',
        'tableId': '5624df2794b5ece427bb39a2',
        'orderTime': '2016-03-10T12:49:28.975Z', // ordertime changed
        'status': 'Ordered'
        // 'created': '2016-03-10T12:49:28.981Z'
      });
      var sampleFoodOrderServed = new FoodOrders({
        'food': '5638ae3d93b03cc83b4a0281',
        'user': '561df0c78f8fd758130dc531',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee542',
        'customer': '56d983937dcd96382f285041',
        'tableId': '5624df2794b5ece427bb39a1',
        'orderTime': '2016-03-10T12:49:28.976Z',
        'status': 'Served'
        // 'created': '2016-03-10T12:49:28.991Z'
      });

      var sampleFoodOrdersWithServed = [sampleFoodOrder, sampleFoodOrder2, sampleFoodOrderServed];

      var pages = [{
        '_id': '561df0f88e4dd82a814e7fc3',
        'pageName': 'Barcodes',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '561df0f88e4dd82a814e7fcb',
        'pageName': 'Bill Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '56504948b3bfaa3dbab23950',
        'pageName': 'Billarchive Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }];

      // Create a sample articles array that includes the new article
      var sampleFoodOrders = [sampleFoodOrder2];
      // Set GET response for pages
      /* $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders); */
      $httpBackend.whenGET('pages').respond(pages);

      // Set GET response
      $httpBackend.whenGET('foodorders').respond(sampleFoodOrdersWithServed);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Set PUT response
      $httpBackend.expectPUT('foodorders/5638ae3d93b03cc83b4a0213').respond();

      sampleFoodOrdersWithServed[0].status = 'Served';
      $httpBackend.whenGET('foodorders').respond(sampleFoodOrdersWithServed);
      scope.makeFoodOrderServed(sampleFoodOrder);
      $httpBackend.flush();
      // Test scope value
      expect(scope.foodordersLength).toEqualData(sampleFoodOrders);
    }));

    it('$scope.makeFoodOrderServed() should create a blank array after served is clicked with two foodorders having same ordertime', inject(function(FoodOrders) {
      // Create sample article using the Articles service
      var sampleFoodOrder = new FoodOrders({
        '_id': '5638ae3d93b03cc83b4a0213',
        'food': '5638ae3d93b03cc83b4a0283',
        'user': '561df0c78f8fd758130dc534',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee541',
        'customer': '56d983937dcd96382f285043',
        'tableId': '5624df2794b5ece427bb39a9',
        'orderTime': '2016-03-10T12:49:28.973Z',
        'status': 'Ordered'
        // 'created': '2016-03-10T12:49:28.981Z'
      });

      var sampleFoodOrder2 = new FoodOrders({
        '_id': '5638ae3d93b03cc83b4a0214',
        'food': '5638ae3d93b03cc83b4a0282',
        'user': '561df0c78f8fd758130dc532',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee543',
        'customer': '56d983937dcd96382f285042',
        'tableId': '5624df2794b5ece427bb39a2',
        'orderTime': '2016-03-10T12:49:28.973Z', // ordertime same
        'status': 'Ordered'
        // 'created': '2016-03-10T12:49:28.981Z'
      });

      var sampleFoodOrderServed = new FoodOrders({
        'food': '5638ae3d93b03cc83b4a0281',
        'user': '561df0c78f8fd758130dc531',
        'quantity': 1,
        'rental': '56e16d547c990f04376ee542',
        'customer': '56d983937dcd96382f285041',
        'tableId': '5624df2794b5ece427bb39a1',
        'orderTime': '2016-03-10T12:49:28.976Z',
        'status': 'Served'
        // 'created': '2016-03-10T12:49:28.991Z'
      });

      var sampleFoodOrdersWithServed = [sampleFoodOrder, sampleFoodOrder2, sampleFoodOrderServed];

      var pages = [{
        '_id': '561df0f88e4dd82a814e7fc3',
        'pageName': 'Barcodes',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '561df0f88e4dd82a814e7fcb',
        'pageName': 'Bill Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }, {
        '_id': '56504948b3bfaa3dbab23950',
        'pageName': 'Billarchive Details',
        'roles': ['admin'],
        'created': '2016-03-11T11:12:04.234Z'
      }];

      // Create a sample articles array that includes the new article
      var sampleFoodOrders = [sampleFoodOrder2];
      // Set GET response for pages
      /* $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders);
      $httpBackend.expectGET('pages').respond(sampleFoodOrders); */
      $httpBackend.whenGET('pages').respond(pages);

      // Set GET response
      $httpBackend.whenGET('foodorders').respond(sampleFoodOrdersWithServed);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Set PUT response
      $httpBackend.expectPUT('foodorders/5638ae3d93b03cc83b4a0213').respond();
      $httpBackend.expectPUT('foodorders/5638ae3d93b03cc83b4a0214').respond();

      sampleFoodOrdersWithServed[0].status = 'Served';
      sampleFoodOrdersWithServed[1].status = 'Served';
      $httpBackend.whenGET('foodorders').respond(sampleFoodOrdersWithServed);

      scope.makeFoodOrderServed(sampleFoodOrder);
      $httpBackend.flush();

      // Test scope value
      expect(scope.foodordersLength).toEqualData([]);
    }));

  });
}());
