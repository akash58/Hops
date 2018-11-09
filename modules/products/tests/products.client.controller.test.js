'use strict';

(function() {
	// Product client controller
	describe('ProductsController', function() {
		// Initialize global variables
		var ProductsController,
			scope,
			pages,
			Authentication,
			$httpBackend,
			$stateParams,
			$location;
		var $window;
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_,$window/* , _pages_ */) {
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
			$window = jasmine.createSpyObj('$window', ['confirm']);
			// Initialize the Articles controller.
			ProductsController = $controller('ProductsController', {
				$scope: scope,
				$window: $window
			});
		}));

		it('$scope.find() should create an array with at least one product object fetched from XHR', inject(function(Products,Specvalues,Categories ,Pages,Contents,Contentgroups ) {
			
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			
			var samplePages = [samplePage];
			
			// Created sample Product using the products service
			var sampleProduct = new Products({
				productNumber: 'catan version 1'
				//content: 'MEAN rocks!'
			});
			// Created a sample products array that includes the new product
			var sampleProducts = [sampleProduct];

			// Created sample spec value using the Specvalues service
			var sampleSpecvalue=new Specvalues({
				specificationValue: 'value' 
			});
			var sampleSpecvalues = [sampleSpecvalue];

			// Created sample categories using the Categories service
			var sampleCategorie= new Categories({
				categoryName : 'super'
			});
			var sampleCategories = [sampleCategorie];	

			// Created sample Content using the Contents service
			var sampleContent = new Contents({
				contentName: 'Red',
				numberOfItems: '4'
			});
			var sampleContents = [sampleContent];

			// Create sample contentGroup using the Contentgroups service
			var samplecontentGroup = new Contentgroups({
				contentGroupName: 'Dice'
			});
			var sampleContentgroups = [samplecontentGroup];


			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('products').respond(sampleProducts);
			$httpBackend.expectGET('specvalues').respond(sampleSpecvalues);
			$httpBackend.expectGET('categories').respond(sampleCategories);
			$httpBackend.expectGET('contents').respond(sampleContents);
			$httpBackend.expectGET('contentgroups').respond(sampleContentgroups);
			

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.products).toEqualData(sampleProducts);
			expect(scope.specvalues).toEqualData(sampleSpecvalues);
			expect(scope.categories).toEqualData(sampleCategories);
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
/*	To test if $scope.creteProduct() returns a error if $scope.prod.category ==='' .
*/
		it('$scope.createProduct() should returns a error if $scope.prod.category is blank.',inject(function(Pages,Products){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];

			scope.prod={category:''};
			// Create a sample component response
			var sampleProductResponse = new Products({
				_id: '525cf20451979dea2c000002',
				productNumber: 'Jungle',
				category:'525cf20451979dea2c000003',
				component:'525cf20451979dea2c000004'
			});
			var component={'id':'525cf20451979dea2c000004'};

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.createProduct(component);
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.errorProduct).toEqual('Please Select Category Before Saving Game');

		}));
/*	To test if $scope.createProduct() send a POST request with the form input values
*/		
		it('$scope.createProduct() with valid form data should send a POST request with the form input values', inject(function(Products,Specvalues) {
			
			
			// Create a sample component object
			var sampleProductPostData = new Products({
				productNumber: 'Jungle',
				category:'525cf20451979dea2c000003'
			});

			// Create a sample component response
			var sampleProductResponse = new Products({
				_id: '525cf20451979dea2c000002',
				productNumber: 'Jungle',
				category:'525cf20451979dea2c000003',
				component:'525cf20451979dea2c000004'
			});
			var component={'id':'525cf20451979dea2c000004'};

			// Fixture mock form input values
			scope.prod={'category' :'525cf20451979dea2c000003','productNumber':'Jungle'};
			
			scope.searchTextProd = {txt : ''};
			scope.curPageProduct = {currentPage:1} ;
			
			var sampleproducts = [sampleProductResponse];
			/* sample data for spec value for get. 
			*/
			var sampleSpecvalue=new Specvalues({
				specificationValue: 'value' 
			});
			var sampleSpecvalues = [sampleSpecvalue];

			
			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleproducts);
			$httpBackend.expectGET('pages').respond(sampleproducts);
			$httpBackend.expectGET('pages').respond(sampleproducts);
			$httpBackend.expectGET('pages').respond(sampleproducts);
			$httpBackend.expectGET('pages').respond(sampleproducts);

			// Set POST response
			$httpBackend.expectPOST('products', sampleProductPostData).respond(sampleProductResponse);
			$httpBackend.expectGET('products').respond(sampleproducts);
			$httpBackend.expectGET('specvalues').respond(sampleSpecvalues);

			// Run controller functionality
			scope.createProduct(component);
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.prod.category).toEqual('');
		}));

		it('$scope.refreshContents() with valid form data should Query the contents and the contentgroups', inject(function(Contents,Contentgroups) {
			
			// Created sample Content using the Contents service
			var sampleContent = new Contents({
				contentName: 'Red',
				numberOfItems: '4'
			});
			var sampleContents = [sampleContent];

			// Create sample contentGroup using the Contentgroups service
			var samplecontentGroup = new Contentgroups({
				contentGroupName: 'Dice',
				contentButtonClick:'true',
				totalItems:'4'
			});
			var samplecontentGroupObj={contentGroupName: 'Dice',contentButtonClick:true,totalItems:'04'};
			//samplecontentGroup.contentButtonClick='true';
			//samplecontentGroup.totalItems='4';
			var sampleContentgroups = [samplecontentGroupObj];
			//console.log(sampleContentgroups);
			// Fixture mock form input values
			
			scope.searchTextProd = {txt : ''};
			scope.curPageProduct = {currentPage:1} ;
			
			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleContents);
			$httpBackend.expectGET('pages').respond(sampleContents);
			$httpBackend.expectGET('pages').respond(sampleContents);
			$httpBackend.expectGET('pages').respond(sampleContents);
			$httpBackend.expectGET('pages').respond(sampleContents);

			$httpBackend.expectGET('contents').respond(sampleContents);
			$httpBackend.expectGET('contentgroups').respond(sampleContentgroups);
			//console.log(scope.contentgroups);
			// Run controller functionality
			scope.refreshContents();
			$httpBackend.flush();

			// Test form inputs are reset
			//console.log(scope.contentgroups);
			expect(scope.contents).toEqualData(sampleContents);
			expect(scope.contentgroups).toEqualData(sampleContentgroups);
		}));
/* 		This test is to check if the click product function works prefectly. 
*/
		it('$scope.clickProduct() should make pass product as an active product',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];


			scope.products=[{'_id':'56c1ab1af2c91e8c09dc632e','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 1','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632c','__v':0,'active':true,'productName':'','created':'2016-02-15T10:40:26.413Z'},{'_id':'56c1ab1af2c91e8c09dc632d','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 2','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632b','__v':0,'active':true,'productName':'','created':'2016-02-15T10:40:26.413Z'}];

			var productToPass=scope.products[1];

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.flush();
			scope.clickProduct(productToPass);
			//scope.activeProduct
			expect(scope.activeProduct).toEqualData('56c1ab1af2c91e8c09dc632d');
			expect(scope.activeProductNumber).toEqualData('catan ver 2');

		}));
/*		This function is to check if the click content group function work properly or not.
*/
		it('$scope.clickContentGrp() should make pass Contentgroup as an active contentgroup',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];

			scope.con={contentName: '',numberOfItems :''};
			
			scope.contentgroups=[{'_id':'56c1ab49f2c91e8c09dc6331','user':'56c1a8e9f2c91e8c09dc6327','product':'56c1ab1af2c91e8c09dc632e','contentGroupName':'dies','__v':0,'created':'2016-02-15T10:41:13.306Z','contentButtonClick':true,'totalItems':12}, {'_id':'56c1ab49f2c91e8c09dc6332','user':'56c1a8e9f2c91e8c09dc6327','product':'56c1ab1af2c91e8c09dc632e','contentGroupName':'roller','__v':0,'created':'2016-02-15T10:41:13.306Z','contentButtonClick':false,'totalItems':4}];

			var contentgroupPass=scope.contentgroups[1];

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.flush();
			scope.clickContentGrp(contentgroupPass);
			
			expect(scope.activeContentgroup).toEqualData('56c1ab49f2c91e8c09dc6332');
			expect(scope.activeContentGroupName).toEqualData('roller');
			expect(scope.con.contentName).toEqualData('');
			expect(scope.con.numberOfItems).toEqualData('');



		}));

/*		Test case to test $scope.addProductbuttonclicked() if the $scope.addProductclicked variable toggle or not.
*/

		it('$scope.addProductbuttonclicked() function should toggle $scope.addProductclicked variable',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];


			scope.addProductclicked=true;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.flush();

			scope.addProductbuttonclicked();
			expect(scope.addProductclicked).toEqualData(false);

		}));
/*		Test case to test $scope.addContentGroupButtonClicked() if the $scope.contentGroupButtonClick variable toggle or not.
*/

		it('$scope.addContentGroupButtonClicked() function should toggle $scope.contentGroupButtonClick variable',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			scope.conGrp={contentGroup : 'Red'};

			scope.contentGroupButtonClick=false;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.flush();

			scope.addContentGroupButtonClicked();
			expect(scope.contentGroupButtonClick).toEqualData(true);
			expect(scope.conGrp.contentGroup).toEqualData('');

		}));

/*		Test case to test $scope.addContentButtonClicked() if the $scope.contentgroups[i].contentButtonClick variable 			toggle or not.
*/

		it('$scope.addContentButtonClicked() function should toggle $scope.contentgroups[i].contentButtonClick variable',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];

			//sample contentgroup data for the function testing.
			scope.contentgroups=[{'_id':'56c1ab49f2c91e8c09dc6331','user':'56c1a8e9f2c91e8c09dc6327','product':'56c1ab1af2c91e8c09dc632e','contentGroupName':'dies','__v':0,'created':'2016-02-15T10:41:13.306Z','contentButtonClick':true,'totalItems':12}, {'_id':'56c1ab49f2c91e8c09dc6332','user':'56c1a8e9f2c91e8c09dc6327','product':'56c1ab1af2c91e8c09dc632e','contentGroupName':'roller','__v':0,'created':'2016-02-15T10:41:13.306Z','contentButtonClick':false,'totalItems':4}];

			var contentgroupPass=scope.contentgroups[1]._id;

			scope.con={contentName : 'Red',numberOfItems:'4'};

			//scope.contentGroupButtonClick=false;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.flush();

			scope.addContentButtonClicked(contentgroupPass);
			//expect(scope.contentGroupButtonClick).toEqualData(true);
			// console.log(contentgroupPass);
			// console.log(scope.contentgroups[1].contentButtonClick);
			expect(scope.contentgroups[1].contentButtonClick).toEqualData(true);
			expect(scope.con.contentName).toEqualData('');
			expect(scope.con.numberOfItems).toEqualData('');

		}));
/*		This test is to test the createContentGroup function saves the content group successfully.
*/
		it('$scope.createContentGroup() with valid form data should send a POST request with the form input values', inject(function(Contentgroups,Pages) {
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			// Created sample Content using the Contents service
			/*var sampleContent = new Contents({
				contentName: 'Red',
				numberOfItems: '4'
			});*/
			var sampleContentsObj={contentName: 'Red',numberOfItems: '4'};
			scope.contents = [sampleContentsObj];

			//Sample data for content group.
			var samplecontentGroupPostData = new Contentgroups({
				contentGroupName: 'Dice',
				product:'58c1ab49f2c91e8c09dc6888'
			});
			var samplecontentGroupPostDatas = [samplecontentGroupPostData];
			var product={_id:'58c1ab49f2c91e8c09dc6888'};
			
			/*var samplecontentGroupResponse = new Contentgroups({
				_id: '56c1ab49f2c91e8c09dc6333',
				product:'58c1ab49f2c91e8c09dc6888',
				contentGroupName: 'Dice'
			});*/
				
			var samplecontentGroupObj={_id: '56c1ab49f2c91e8c09dc6333',contentGroupName: 'Dice',product:'58c1ab49f2c91e8c09dc6888',contentButtonClick : true, totalItems : 0};
			
			var samplecontentGroupResponses=[samplecontentGroupObj];
			
			scope.conGrp={contentGroup : 'Dice'};
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set POST response
			$httpBackend.expectPOST('contentgroups', samplecontentGroupPostData).respond(samplecontentGroupObj);
			$httpBackend.expectGET('contentgroups').respond(samplecontentGroupResponses);
			//.respond(samplecontentGroupResponses)
			// Run controller functionality
			scope.createContentGroup(product);
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.contentgroups).toEqualData(samplecontentGroupResponses);
			expect(scope.savedContentGroupSuccessfully).toEqualData(true);
			expect(scope.errorContentGroup).toEqualData('');
		}));
/*		To Test if contentGrpRemove removes the pass content group record and not the other records.
*/
		it('$scope.contentGrpRemove() should send a DELETE request with a valid contentGrpId and remove the Contentgroup from the scope', inject(function(Contentgroups,Contents) {
			
			var samplecontentGroupPostData = new Contentgroups({
				_id:'56c1ab49f2c91e8c09dc6331',
				contentGroupName: 'Dice',
				product:'58c1ab49f2c91e8c09dc6888'
			});

			var samplecontentGroupPostDatas = [samplecontentGroupPostData];
						
			scope.contentgroups = [samplecontentGroupPostData];
			//sample contents data 
			//scope.contents = [{'_id':'56c1abaaf2c91e8c09dc6332','user':'56c1a8e9f2c91e8c09dc6327','contentgroup':'56c1ab49f2c91e8c09dc6331','contentName':'red','numberOfItems':4,'__v':0,'created':'2016-02-15T10:42:50.491Z'},{'_id':'56c1abb9f2c91e8c09dc6333','user':'56c1a8e9f2c91e8c09dc6327','contentgroup':'56c1ab49f2c91e8c09dc6332','contentName':'blue','numberOfItems':4,'__v':0,'created':'2016-02-15T10:43:05.107Z'}];
			var samplecontentData=new Contents({
				_id:'56c1abaaf2c91e8c09dc6332',
				user:'56c1a8e9f2c91e8c09dc6327',
				contentgroup:'56c1ab49f2c91e8c09dc6331',
				contentName:'red',
				numberOfItems:4,
				__v:0,
				created:'2016-02-15T10:42:50.491Z'
			});
			scope.contents=[samplecontentData];
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);

			
			// Set expected DELETE response
			
			$httpBackend.whenDELETE(/contents\/([0-9a-fA-F]{24})$/).respond(204);
			$httpBackend.expectDELETE(/contentgroups\/([0-9a-fA-F]{24})$/).respond(204);
			// Run controller functionality
			scope.contentGrpRemove(samplecontentGroupPostData);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.contentgroups.length).toEqual(0);
			expect(scope.contents.length).toEqual(0);
		}));
/*	To test if alertDeleteCtnGrp() function calls contentGrpRemove() function successfully when user input for for alert 	is yes.
*/
		it('$scope.alertDeleteCtnGrp()',inject(function(Pages,Contentgroups,Contents){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			// Define a sample component put data
			var samplecontentGroupPostData = new Contentgroups({
				_id:'56c1ab49f2c91e8c09dc6331',
				contentGroupName: 'Dice',
				product:'58c1ab49f2c91e8c09dc6888'
			});
			var samplecontentGroupPostDatas = [samplecontentGroupPostData];
        	//spyOn(window, "confirm").and.returnValue('Are You Sure To Delete!');
        	spyOn(window, 'confirm').and.returnValue(true);
			//console.log(test);
			
						
			scope.contentgroups = [samplecontentGroupPostData];

			var samplecontentData=new Contents({
				_id:'56c1abaaf2c91e8c09dc6332',
				user:'56c1a8e9f2c91e8c09dc6327',
				contentgroup:'56c1ab49f2c91e8c09dc6331',
				contentName:'red',
				numberOfItems:4,
				__v:0,
				created:'2016-02-15T10:42:50.491Z'
			});
			scope.contents=[samplecontentData];
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			
			// Set expected DELETE response
			
			$httpBackend.whenDELETE(/contents\/([0-9a-fA-F]{24})$/).respond(204);
			$httpBackend.whenDELETE(/contentgroups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.alertDeleteCtnGrp(samplecontentGroupPostData);
			$httpBackend.flush();

			expect(window.confirm).toHaveBeenCalledWith('Are You Sure To Delete!');
			// Test array after successful delete
			expect(scope.contentgroups.length).toEqual(0);
			expect(scope.contents.length).toEqual(0);
		}));

/*		This test is to test if updateContentGroup functions updates the content group without any errors.
*/		
		
		it('$scope.updateContentGroup() should update a valid Contentgroup', inject(function(Contentgroups) {
			// Define a sample component put data
			var samplecontentGroupPostData = new Contentgroups({
				_id:'56c1ab49f2c91e8c09dc6331',
				contentGroupName: 'Dice',
				product:'58c1ab49f2c91e8c09dc6888'
			});

			var samplecontentGroupPostDatas = [samplecontentGroupPostData];
						
			scope.contentgroups = [samplecontentGroupPostData];

			// Mock component in scope
			
			//scope.component = sampleComponentPutData;

			scope.conGrp={contgrpName : 'yahoo'};
			//scope.authentication = {user : 'admin'};
			scope.authentication = {user : {_id:'52c1ab49f2c91e8c09dc6331'}};
			
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);
			$httpBackend.expectGET('pages').respond(samplecontentGroupPostDatas);


			// Set PUT response
			$httpBackend.expectPUT(/contentgroups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.updateContentGroup(samplecontentGroupPostData);
			$httpBackend.flush();

			expect(scope.updatedSuccessfullyContentgroup).toEqualData(true);
			// Test URL location to new object
			//expect($location.path()).toBe('/components/' + sampleComponentPutData._id);
		}));

/*		To Test if the createContent function creates the content successfully without any errors.
*/
		it('$scope.createContent() should create content successfully ',inject(function(Contents){
			//sample data to post 
			var sampleContentPostData = new Contents({
				contentName: 'red',
				numberOfItems: '04',
				contentgroup: '56c1ab49f2c91e8c09dc6333'
			});
			var sampleContentsPostData =[sampleContentPostData];
			//variable initialization
			scope.con={contentName:'red',numberOfItems:'04'};

			var sampleContentResponseData={_id	:'56c1ab49f2c91e8c09dc6334',contentgroup: '56c1ab49f2c91e8c09dc6333',contentName: 'red',numberOfItems: '04'};
			var sampleContentsResponseData =[sampleContentResponseData];
			//content group sample data.
			var samplecontentGroupObj={_id: '56c1ab49f2c91e8c09dc6333',contentGroupName: 'Dice',product:'58c1ab49f2c91e8c09dc6888',contentButtonClick : true, totalItems : 0};
			scope.contentgroups=[samplecontentGroupObj];
			
			var samplecontentGroupResponses=[samplecontentGroupObj];
			// Set GET response
			$httpBackend.expectGET('pages').respond(sampleContentsPostData);
			$httpBackend.expectGET('pages').respond(sampleContentsPostData);
			$httpBackend.expectGET('pages').respond(sampleContentsPostData);
			$httpBackend.expectGET('pages').respond(sampleContentsPostData);
			$httpBackend.expectGET('pages').respond(sampleContentsPostData);

			// Set POST response
			$httpBackend.expectPOST('contents', sampleContentPostData).respond(sampleContentResponseData);
			$httpBackend.expectGET('contents').respond(sampleContentsResponseData);
			// Run controller functionality
			scope.createContent(samplecontentGroupObj);
			$httpBackend.flush();


			expect(scope.contents).toEqualData(sampleContentsResponseData);
		}));

/*		To test if the $scope.editContentgroupButtonClicked function should assign the content group name to 
		$scope.conGrp.contgrpName and makes the contentgroup.editContentgroupNameClicked to true. 
*/
		it('$scope.editContentgroupButtonClicked function should assign the content group name to $scope.conGrp.contgrpName and makes the contentgroup.editContentgroupNameClicked to true.',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			
			var samplePages = [samplePage];

			scope.conGrp={contgrpName:''};
			//sample contentgroup data.
			var samplecontentGroupObj={_id: '56c1ab49f2c91e8c09dc6333',contentGroupName: 'Dice',product:'58c1ab49f2c91e8c09dc6888',contentButtonClick : true, totalItems : 0,editContentgroupNameClicked:false};
			scope.contentgroups=[samplecontentGroupObj];
			
			var samplecontentGroupResponses=[samplecontentGroupObj];
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.editContentgroupButtonClicked(samplecontentGroupObj);
			$httpBackend.flush();
			

			expect(scope.conGrp.contgrpName).toEqualData('Dice');
			//expect(contentgroup.editContentgroupNameClicked).toEqualData(true);
		}));
/*	To test $scope.alertDeleteCtn() function calls the window confrim and based on that makes a proper function call.
*/
		it('$scope.alertDeleteCtn() should make a perfect function call based on a windows.confirm result',inject(function(Pages,Contents,Contentgroups){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			spyOn(window, 'confirm').and.returnValue(true);
			//scope.contentRemove = jasmine.createSpy().and.returnValue(true);
			//spyOn('contentRemove');
			var samplecontentData=new Contents({
				_id:'56c1abaaf2c91e8c09dc6332',
				user:'56c1a8e9f2c91e8c09dc6327',
				contentgroup:'56c1ab49f2c91e8c09dc6331',
				contentName:'red',
				numberOfItems:4,
				__v:0,
				created:'2016-02-15T10:42:50.491Z'
			});
			scope.contents=[samplecontentData];

			var samplecontentGroupPostData = new Contentgroups({
				_id:'56c1ab49f2c91e8c09dc6331',
				contentGroupName: 'Dice',
				product:'58c1ab49f2c91e8c09dc6888'
			});
			var samplecontentGroupPostDatas = [samplecontentGroupPostData];
			scope.contentgroups = [samplecontentGroupPostData];


			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			// Set expected DELETE response
			
			$httpBackend.whenDELETE(/contents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.alertDeleteCtn(samplecontentData);
			$httpBackend.flush();

			expect(window.confirm).toHaveBeenCalledWith('Are You Sure To Delete!');
			expect(scope.contents.length).toEqual(0);
			//expect(contentRemove).toHaveBeenCalled();
		}));
/*		To test if the content is get removed successfully.
*/
		it('$scope.contentRemove() should remove  ',inject(function(Pages,Contents){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];

			var sampleContentData=new Contents({
				_id:'56c1abaaf2c91e8c09dc6332'
			});
			//sample content data.
			scope.contents = [{'_id':'56c1abaaf2c91e8c09dc6332','user':'56c1a8e9f2c91e8c09dc6327','contentgroup':'56c1ab49f2c91e8c09dc6331','contentName':'red','numberOfItems':4,'__v':0,'created':'2016-02-15T10:42:50.491Z'},{'_id':'56c1abb9f2c91e8c09dc6333','user':'56c1a8e9f2c91e8c09dc6327','contentgroup':'56c1ab49f2c91e8c09dc6331','contentName':'blue','numberOfItems':4,'__v':0,'created':'2016-02-15T10:43:05.107Z'}];
			var sampleContentsData =scope.contents;
			
			var resultExpected=[{'_id':'56c1abb9f2c91e8c09dc6333','user':'56c1a8e9f2c91e8c09dc6327','contentgroup':'56c1ab49f2c91e8c09dc6331','contentName':'blue','numberOfItems':4,'__v':0,'created':'2016-02-15T10:43:05.107Z'}];

			scope.contentgroups=[{'_id':'56c1ab49f2c91e8c09dc6331','user':'56c1a8e9f2c91e8c09dc6327','product':'56c1ab1af2c91e8c09dc632e','contentGroupName':'dies','__v':0,'created':'2016-02-15T10:41:13.306Z','contentButtonClick':true,'totalItems':12}, {'_id':'56c1ab49f2c91e8c09dc6332','user':'56c1a8e9f2c91e8c09dc6327','product':'56c1ab1af2c91e8c09dc632e','contentGroupName':'roller','__v':0,'created':'2016-02-15T10:41:13.306Z','contentButtonClick':false,'totalItems':4}];
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set expected DELETE response
			$httpBackend.expectDELETE(/contents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.contentRemove(sampleContentData);
			$httpBackend.flush();

			expect(scope.contents).toEqualData(resultExpected);
		}));
/*		To test if updateSpecValues() function which calls the updateSpecValue() in callback updates the specvalue 				successfully, with out any error and also check if its makes the callback properly.
*/
		it('updateSpecValues() updates the specvalue successfully and the calls the callback with success',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			var activeProduct='catan ver 7';
			scope.specvalues=[{'_id':'56c42d1fc7153c68472afba9','user':'56c1a8e9f2c91e8c09dc6327','specdesc':{'_id':'56c1aa4ef2c91e8c09dc632a','user':'56c1a8e9f2c91e8c09dc6327','component':'56c1aa12f2c91e8c09dc6328','__v':0,'specificationDescription':'maximum players','created':'2016-02-15T10:37:02.191Z'},'product':{'_id':'56c42d1fc7153c68472afba8','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 7','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632c','__v':0,'active':true,'productName':'','created':'2016-02-17T08:19:43.122Z'},'__v':0,'specificationValue':'','created':'2016-02-17T08:19:43.131Z'},{'_id':'56c42d1fc7153c68472afbaa','user':'56c1a8e9f2c91e8c09dc6327','specdesc':{'_id':'56c1aa2ff2c91e8c09dc6329','user':'56c1a8e9f2c91e8c09dc6327','component':'56c1aa12f2c91e8c09dc6328','__v':0,'specificationDescription':'minimum players','created':'2016-02-15T10:37:12.447Z'},'product':{'_id':'56c42d1fc7153c68472afba8','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 7','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632c','__v':0,'active':true,'productName':'','created':'2016-02-17T08:19:43.122Z'},'__v':0,'specificationValue':'','created':'2016-02-17T08:19:43.131Z'}];

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set PUT response
			$httpBackend.whenPUT(/specvalues\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.updateSpecValues(activeProduct);
			$httpBackend.flush();

			//expect(scope.contents).toEqualData(resultExpected);
		}));

/*	To check if updateSpecValue() function updates the specvalue successfully and also to check the updated value if its 	has updated correct value.
*/
		it('$scope.updateSpecValue() function should update the specvalues successfully',inject(function(Pages,Specvalues){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			
			var sampleSpecvaluePutData={'_id':'56c42d1fc7153c68472afba9','user':'56c1a8e9f2c91e8c09dc6327','specdesc':{'_id':'56c1aa4ef2c91e8c09dc632a','user':'56c1a8e9f2c91e8c09dc6327','component':'56c1aa12f2c91e8c09dc6328','__v':0,'specificationDescription':'maximum players','created':'2016-02-15T10:37:02.191Z'},'product':{'_id':'56c42d1fc7153c68472afba8','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 7','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632c','__v':0,'active':true,'productName':'','created':'2016-02-17T08:19:43.122Z'},'__v':0,'specificationValue':'value','created':'2016-02-17T08:19:43.131Z'};
			var sampleSpecValueOfPutNotExpected={'_id':'56c42d1fc7153c68472afba9','user':'56c1a8e9f2c91e8c09dc6327','specdesc':{'_id':'56c1aa4ef2c91e8c09dc632a','user':'56c1a8e9f2c91e8c09dc6327','component':'56c1aa12f2c91e8c09dc6328','__v':0,'specificationDescription':'maximum players','created':'2016-02-15T10:37:02.191Z'},'product':{'_id':'56c42d1fc7153c68472afba8','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 7','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632c','__v':0,'active':true,'productName':'','created':'2016-02-17T08:19:43.122Z'},'__v':0,'specificationValue':'valueChanged','created':'2016-02-17T08:19:43.131Z'};

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set PUT response
			$httpBackend.whenPUT(/specvalues\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.updateSpecValue(sampleSpecvaluePutData);
			$httpBackend.flush();

			expect(sampleSpecvaluePutData).not.toEqualData(sampleSpecValueOfPutNotExpected);

		}));
/*	To test if $scope.updateProd() function updates the product successfully.
*/
		it('$scope.updateProd() function should update the product values successfully',inject(function(Pages,Products){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			//sample product data to perform update function.
			var sampleProductData=new Products({
				_id : '56c42d1fc7153c68472afba9',
				productNumber : 'Catan ver 6',
				user : '56c1a8e9f2c91e8c09dc6327'
			});

			scope.prod={updateProdNum:'Catan ver 2'};

			var expectedProductData={_id : '56c42d1fc7153c68472afba9',productNumber : 'Catan ver 2',user : '56c1a8e9f2c91e8c09dc6327', editingProductName : false };
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set PUT response
			$httpBackend.whenPUT(/products\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.updateProd(sampleProductData);
			$httpBackend.flush();

			expect(sampleProductData).toEqualData(expectedProductData);

		}));
/*	To test if $scope.updateProductCategory() function updates the product successfully.
*/
		it('$scope.updateProductCategory() function should update the product values successfully',inject(function(Pages,Products){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			//sample product data to perform update function.
			var sampleProductData=new Products({
				_id : '56c42d1fc7153c68472afba9',
				productNumber : 'Catan ver 6',
				user : '56c1a8e9f2c91e8c09dc6327',
				category:'56c1aae4f2c91e8c09dc632b'
			});

			//scope.prod={updateProdNum:'Catan ver 2'};

			var notExpectedProductData={_id : '56c42d1fc7153c68472afba9',productNumber : 'Catan ver 2',user : '56c1a8e9f2c91e8c09dc6327', category:'56c1aae4f2c91e8c09dc632a' };
		
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set PUT response
			$httpBackend.whenPUT(/products\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.updateProductCategory(sampleProductData);
			$httpBackend.flush();

			expect(sampleProductData).not.toEqualData(notExpectedProductData);

		}));
/*	To test if getComponentforProduct returns the correct product component as a return value.
*/
		it('$scope.getComponentforProduct() should return the correct product component as a return value ',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			//sample product data 
			var sampleProductData=[{'_id':'56c42cedc7153c68472afb9f','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 4','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aae4f2c91e8c09dc632b','__v':0,'active':true,'productName':'','created':'2016-02-17T08:18:53.447Z'},{'_id':'56c42cdec7153c68472afb9c','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 3','component':'56c1aa12f2c91e8c09dc6329','category':'56c1ab09f2c91e8c09dc632d','__v':0,'active':true,'productName':'','created':'2016-02-17T08:18:38.879Z'}];
			scope.products=sampleProductData;
			var productPass=sampleProductData[0]._id;


			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			var returnResult= scope.getComponentforProduct(productPass);
			$httpBackend.flush();

			expect(returnResult).toEqualData('56c1aa12f2c91e8c09dc6328');
		}));
/* To test if $scope.editProductButtonClicked() function initialized $scope.prod.updateProdNum to product.productNumber.
*/
		it('$scope.editProductButtonClicked() function should initialized $scope.prod.updateProdNum to product.productNumber ',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			
			scope.prod={updateProdNum:''};

			var sampleProductToPass={productNumber:'Catan ver 2',editingProductName:false};

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.editProductButtonClicked(sampleProductToPass);
			$httpBackend.flush();

			expect(scope.prod.updateProdNum).toEqualData('Catan ver 2');
			expect(sampleProductToPass.editingProductName).toEqualData(true);

		}));
/*	To test if $scope.cancel() function toggles $scope.IsVisible & $scope.IsDisabled variable.
*/
		it('$scope.cancel() function should toggle $scope.IsVisible and &scope.IsDisabled variable in a function. ',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			scope.IsVisible=false;
			scope.IsDisabled=false;
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.cancel();
			$httpBackend.flush();

			expect(scope.IsVisible).toEqualData(true);
			expect(scope.IsDisabled).toEqualData(true);
		}));
/*	To test if $scope.focusSpecValue() function set $scope.errorSpecValue & $scope.updatedSuccessfullySpecValue to false.
*/
		it('$scope.focusSpecValue() function should set $scope.errorSpecValue and $scope.updatedSuccessfullySpecValue variables to false. ',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
				
			}); 
			var samplePages = [samplePage];
			scope.errorSpecValue = true;
			scope.updatedSuccessfullySpecValue = true;
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.focusSpecValue();
			$httpBackend.flush();

			expect(scope.errorSpecValue).toEqualData(false);			
			expect(scope.updatedSuccessfullySpecValue).toEqualData(false);			
		}));
/*	To test $scope.clearActiveProduct() function clears the $scope.activeProduct variable.
*/
		it('$scope.clearActiveProduct() function should clear $scope.activeProduct to blank.',inject(function(Pages){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
			}); 
			var samplePages = [samplePage];

			scope.activeProduct = 'Catan ver 1';
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.clearActiveProduct();
			$httpBackend.flush();

			expect(scope.activeProduct).toEqualData('');
		}));
/*	To test deactivateProduct() function deactivates the pass product as parameter to the function.
*/
		it('$scope.deactivateProduct() should deactivateProduct which is been pass as an parameter to the function and also update the serial for that product. ',inject(function(Pages,Products,Serials,Serialactivitys){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
			}); 
			var samplePages = [samplePage];
			//making a spy for 
			spyOn(window, 'confirm').and.returnValue(true);
			spyOn(scope,'junkSerialActivity');//.and.returnValue(sampleSerialactivityResponse)

			// Created sample Product using the products service
			var sampleProduct = new Products({
				_id : '56c42d1fc7153c68472afba9',
				productNumber : 'catan version 1',
				component : '525cf20451979dea2c000004',
				active : true
				//content: 'MEAN rocks!'
			});
			// Created a sample products array that includes the new product
			var sampleProducts = [sampleProduct];
			scope.products=sampleProduct;

			//Expected data of product after the update has perform.
			var expectedProductData={_id : '56c42d1fc7153c68472afba9',productNumber : 'catan version 1',component : '525cf20451979dea2c000004',active : false};
			//Initialization a scope variable
			scope.searchTextProd={txt:''};
			//sample data object for component
			var component={'id':'525cf20451979dea2c000004'};
			//scope variable initialization for pagination.
			scope.curPageProduct={currentPage:1};
			//creating a sample data for serials
			var sampleSerialDataObj={_id : '56c42d1fc7153c68472afbc1',product : {_id:'56c42d1fc7153c68472afba9'},depreciatedValue: 0,residualValue: 1000,status: 'active',dateOfLastActivity : '2016-02-26T13:42:59.586Z'};
			var sampleSerialDatas=[sampleSerialDataObj];
			//expected serial data after put 
			var expectedSerialData={_id : '56c42d1fc7153c68472afbc1',product : {_id:'56c42d1fc7153c68472afba9'},depreciatedValue: 0,residualValue: 1000,status: 'active',dateOfLastActivity : '2016-02-26T13:42:59.586Z'};
			//sample data for serial activity
			var sampleSerialactivity = new Serialactivitys({
				serial : '56c42d1fc7153c68472afbc1',
				depreciatedValue : 0,
				status : 'Junked',
				dateOfActivity : '2016-02-26T13:42:59.586Z'//new Date()
				//residualValue: 500,
				
			});
			var sampleSerialactivitysData=[sampleSerialactivity];
			
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			
			$httpBackend.whenGET('serials').respond(sampleSerialDatas);
			$httpBackend.whenGET('serialactivitys').respond(sampleSerialactivitysData);

			// Set PUT response
			$httpBackend.whenPUT(/products\/([0-9a-fA-F]{24})$/).respond();
			$httpBackend.whenPUT(/serials\/([0-9a-fA-F]{24})$/).respond();
			//set post response
			//$httpBackend.expectPOST('serialactivitys', sampleSerialactivity).respond(sampleSerialactivityResponse);

			// Run controller functionality
			scope.deactivateProduct(sampleProduct,component);
			$httpBackend.flush();

			
			expect(window.confirm).toHaveBeenCalledWith('Are You Sure You Want To Delete!');
			expect(sampleProduct).toEqualData(expectedProductData);
			expect(sampleSerialDataObj).toEqualData(expectedSerialData);

		}));
/*	To test $scope.junkSerialActivity() function save the serial activity successfully with out any error.
*/
		it('$scope.junkSerialActivity() should save the serial activity successfully without any error ',inject(function(Pages,Serialactivitys){
			// Create sample page 
			 var samplePage = new Pages({
				pageName : 'Games',
				roles: 'admin'
			}); 
			var samplePages = [samplePage];
			//sample data for serial activity
			/*var sampleSerialactivity = new Serialactivitys({
				serial : '56c42d1fc7153c68472afbc1',
				depreciatedValue : 0,
				status : 'Junked',
				dateOfActivity : '2016-02-26T13:42:59.586Z'//new Date()
				//residualValue: 500,
				
			});*/
			//creating a sample data for serials
			var sampleSerialDataObj={_id : '56c42d1fc7153c68472afbc1',product : {_id:'56c42d1fc7153c68472afba9'},depreciatedValue: 0,residualValue: 1000,status: 'active',dateOfLastActivity : '2016-02-26T13:42:59.586Z'};
			var sampleSerialDatas=[sampleSerialDataObj];
			//creating sample data for serial activity
			var sampleSerialactivity={serial : '56c42d1fc7153c68472afbc1',depreciatedValue : 0,residualValue: 1000,status : 'Junked',dateOfActivity : '2016-02-26T13:42:59.586Z'};
			var sampleSerialactivitysData=[sampleSerialactivity];
			//sample data for serial activity response
			var sampleSerialactivityResponse = new Serialactivitys({
				_id : '55c42d1fc7153c68472afbc2',
				serial : '56c42d1fc7153c68472afbc1',
				depreciatedValue : 0,
				residualValue: 1000,
				status : 'Junked',
				dateOfActivity : '2016-02-26T13:42:59.586Z'
				//residualValue: 500,
			});
			var sampleSerialactivityResponseData=[sampleSerialactivityResponse];

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			//set post response
			$httpBackend.expectPOST('serialactivitys', sampleSerialactivity).respond(sampleSerialactivityResponse);

			// Run controller functionality
			scope.junkSerialActivity(sampleSerialDataObj);
			$httpBackend.flush();

		}));
		/*
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
		}));*/
	});
}());