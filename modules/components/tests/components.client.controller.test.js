'use strict';

(function() {
	// Articles Controller Spec
	describe('ComponentsController', function() {
		// Initialize global variables
		var ComponentsController,
			scope,
			pages,
			Authentication,
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_/* , _pages_ */) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			Authentication = _Authentication_;
			/* pages = _pages_; */
			
			  // Mock logged in user
				Authentication.user = {
					roles: ['admin']
				};
				// Mock logged in user
				/* pages.user = {
					roles: ['admin']
				}; */
			
			// Initialize the Articles controller.
			ComponentsController = $controller('ComponentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one component object fetched from XHR', inject(function(Components/* ,Pages */) {
			
			// Create sample page 
			/* var pages = new Pages({
				pageName : 'Game Types',
				roles: 'admin'
				
			}); */
			
			
			// Create sample component using the Components service
			var sampleComponent = new Components({
				componentTypeName: 'Jungle'
				//content: 'MEAN rocks!'
			});

			// Create a sample components array that includes the new component
			var sampleComponents = [sampleComponent];

			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('components').respond(sampleComponents);
			

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.components).toEqualData(sampleComponents);
		}));

/*		it('$scope.findOne() should create an array with one component object fetched from XHR using a componentId URL parameter', inject(function(Components) {
			// Define a sample component object
			var sampleComponent = new Components({
				componentTypeName: 'Jungle'
				//content: 'MEAN rocks!'
			});
            var sampleComponents = [sampleComponent];
			// Set the URL parameter
			$stateParams.componentId = '55a88e4333645cb4002a9fa5';

			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			//$httpBackend.expectGET('pages').respond(sampleComponent);
			$httpBackend.expectGET(/components\/([0-9a-fA-F]{24})$/).respond(sampleComponent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.component).toEqualData(sampleComponent);
		}));*/

		it('$scope.createComponent() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Components) {
			// Create a sample component object
			var sampleComponentPostData = new Components({
				componentTypeName: 'Jungle'
				//content: 'MEAN rocks!'
			});

			// Create a sample component response
			var sampleComponentResponse = new Components({
				_id: '525cf20451979dea2c000002',
				componentTypeName: 'Jungle'
				//content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.comp = { 'componentTypeName': 'Jungle'};
			scope.searchTextComp = {text : ''};
			scope.curPageComponent = {currentPage:1} ;
			//scope.comp.componentTypeName = 'Jungle';
			//scope.content = 'MEAN rocks!';
			
				var sampleComponents = [sampleComponentResponse];
			
			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);

			// Set POST response
			$httpBackend.expectPOST('components', sampleComponentPostData).respond(sampleComponentResponse);
			$httpBackend.expectGET('components').respond(sampleComponents);

			// Run controller functionality
			scope.createComponent();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.comp.componentTypeName).toEqual('');
			//expect(scope.content).toEqual('');

			// Test URL redirection after the component was created
			//expect($location.path()).toBe('/components/' + sampleComponentResponse._id);
		}));

/*****************************************************Update Component************************************************************************/		
		
		it('$scope.update() should update a valid component', inject(function(Components) {
			// Define a sample component put data
			var sampleComponentPutData = new Components({
				_id: '525cf20451979dea2c000002',
				componentTypeName: 'Jungleee'
				//content: 'MEAN Rocks!'
			});

			// Mock component in scope
			
			//scope.component = sampleComponentPutData;
			scope.comp={updateCompName : 'yahoo'};
			scope.authentication = {user : 'admin'};
			
			
			var sampleComponents = [sampleComponentPutData];
			
			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);


			// Set PUT response
			$httpBackend.expectPUT(/components\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update(sampleComponentPutData);
			$httpBackend.flush();

			// Test URL location to new object
			//expect($location.path()).toBe('/components/' + sampleComponentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid articleId and remove the article from the scope', inject(function(Components) {
			// Create new components object
			var sampleComponent = new Components({
				_id: '525cf20451979dea2c000003',
				componentTypeName: 'Jungleee'
			});

			// Create new components array and include the article			
			scope.components = [sampleComponent];
			
			var sampleComponents = [sampleComponent];
			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);
			$httpBackend.expectGET('pages').respond(sampleComponents);

			
			// Set expected DELETE response
			$httpBackend.expectDELETE(/components\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleComponent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.components.length).toBe(0);
		}));
	});
}());