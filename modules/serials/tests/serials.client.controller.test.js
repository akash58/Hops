'use strict';

(function() {
	// Product client controller
	describe('SerialsController', function() {
		// Initialize global variables
		var SerialsController,
			scope,
			pages,
			systemparameters,
			serials,
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_,$window ,_Pages_,_SystemParameters_,_Serials_) {
			// Set a new global scope
			scope = $rootScope.$new();
			// Create sample page 
			pages =_Pages_;
			pages = {pageName : 'Serials',roles: ['admin']}; 
			systemparameters= _SystemParameters_;
			systemparameters={'_id':'56c1a971e791361460820013','systemParameterName':'Currency Symbol','defaultValue':'₹','description':'Currency Symbol displayed before prices and revenue throughout the system','value':'₹','created':'2016-02-27T11:21:05.369Z'};
			serials= _Serials_;
			serials=[{'_id':'56c43e00c7153c68472afbbf','user':{'_id':'56c1a8e9f2c91e8c09dc6327','displayName':'admin admin','provider':'local','username':'admin','__v':0,'created':'2016-02-15T10:31:05.954Z','roles':['user','admin'],'email':'admin@gmail.com','lastName':'admin','firstName':'admin'},'product':{'_id':'56c42cdec7153c68472afb9c','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 3','component':'56c1aa12f2c91e8c09dc6328','category':'56c1ab09f2c91e8c09dc632d','__v':0,'active':true,'productName':'','created':'2016-02-17T08:18:38.879Z'},'supplier':{'_id':'56c1aceff2c91e8c09dc6338','user':'56c1a8e9f2c91e8c09dc6327','contactName':'amazonwalla','__v':0,'email':'m@amazon.gmail.com','mobile':8989925765,'telephone':25258752,'designation':'manager','address':'India head office.','companyName':'amazon','created':'2016-02-15T10:48:15.019Z'},'serialNumber':'catan 1110','dateOfPurchase':'2016-02-17T00:00:00.000Z','purchasePrice':12500,'depreciatedValue':12500,'residualValue':12500,'statusDetail' : 'Location in Warehouse : 45','__v':0,'description':'','manufacturerSerialNumber':'c10','status':'In Stock','acquisitionType':'Purchased','dateOfLastActivity':'2016-02-27','dateOfWarrantyExpiry':'2017-02-17T00:00:00.000Z','warrantyPeriod':12,'created':'2016-02-17T09:31:44.299Z','locationWarehouse':'45','usedInForm':false},{'_id':'56c43dc4c7153c68472afbbc','user':{'_id':'56c1a8e9f2c91e8c09dc6327','displayName':'admin admin','provider':'local','username':'admin','__v':0,'created':'2016-02-15T10:31:05.954Z','roles':['user','admin'],'email':'admin@gmail.com','lastName':'admin','firstName':'admin'},'product':{'_id':'56c42cfdc7153c68472afba2','user':'56c1a8e9f2c91e8c09dc6327','productNumber':'catan ver 5','component':'56c1aa12f2c91e8c09dc6328','category':'56c1aaf7f2c91e8c09dc632c','__v':0,'active':true,'productName':'','created':'2016-02-17T08:19:09.382Z'},'supplier':{'_id':'56c1aceff2c91e8c09dc6338','user':'56c1a8e9f2c91e8c09dc6327','contactName':'amazonwalla','__v':0,'email':'m@amazon.gmail.com','mobile':8989925765,'telephone':25258752,'designation':'manager','address':'India head office.','companyName':'amazon','created':'2016-02-15T10:48:15.019Z'},'serialNumber':'catan 119','dateOfPurchase':'2016-02-17T00:00:00.000Z','purchasePrice':8999,'depreciatedValue':8999,'residualValue':8999,'statusDetail' : 'Location in Warehouse : a1b9','__v':0,'description':'','manufacturerSerialNumber':'c9','status':'In Stock','acquisitionType':'Purchased','dateOfLastActivity':'2016-02-27','dateOfWarrantyExpiry':'2017-02-17T00:00:00.000Z','warrantyPeriod':12,'created':'2016-02-17T09:30:44.175Z','locationWarehouse':'a1b9','usedInForm':false}];
			//var samplePages = [samplePage];
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
			SerialsController = $controller('SerialsController', {
				$scope: scope,
				$window: $window
			});
		}));
/*	To test if $scope.initialize() function initialize all the required variables and data. on the setup or when page is 	get loaded.
*/
		it('$scope.initialize() should initialize all the data required, when the get loaded. ',inject(function(){

			var samplePages=[pages];
			var sampleSystemParameters=[systemparameters];
			scope.searchTextSerials={text:''};

			//spyOn(scope, 'shouldRenderForSearchSerials').and.returnValue(true);

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			
			$httpBackend.expectGET('systemparameters?systemParameterName=Currency+Symbol').respond(sampleSystemParameters);
			$httpBackend.expectGET('serials?limit=10&page=1').respond(serials);
			$httpBackend.expectGET('serials/count?searchText=').respond(serials[0]);
			$httpBackend.expectGET('serials?limit=10&page=1&searchText=').respond(serials);

			// Run controller functionality
			scope.initialize();
			$httpBackend.flush();
		}));
/*	To test $scope.find() function initialized all the data which is required for required for the setup for the search 	serial screen.

		it('$scope.find() function should initialized all the data to get the search serial loaded. ',inject(function(){
			//var samplePages=[pages];
			var sampleSystemParameters=[systemparameters];

			// Set GET response
			//$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.whenGET('systemparameters').respond(sampleSystemParameters);
			$httpBackend.whenGET('serials').respond(serials);
			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			expect(scope.currencySymbol).toEqualData('₹');
			
		}));*/
/*	To test $scope.queryPages() function query's the pages successfully.

		it('$scope.queryPages() should query pages successfully. ',inject(function(){
			var samplePages=[pages];
			
			//spyOn(scope, 'shouldRender').and.returnValue(true);

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.queryPages();
			$httpBackend.flush();

			expect(scope.pageVisible).toEqualData(true);
		}));*/
/*	To test $scope.shouldRender() function , that return true or false for the authentication for the serial pages.
	whether the page has the authentication or not.
*/
		/*it('$scope.shouldRender() function should return true',inject(function(){
			var samplePages=[pages];
			scope.pages=samplePages;
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			var returnResult=scope.shouldRender();
			$httpBackend.flush();

			expect(returnResult).toEqualData(true);

			
		}));*/
		/* ********Note: the else part has not been covered in this function,
							 it has to be covered.
							 To covered the else part, the function need to be changed.
							 (need to add else part in the code of function)
				*******
			*/
/*	To test $scope.shouldRenderForSearchSerials()function should return true if the page has the authentication.

		it('$scope.shouldRenderForSearchSerials() should return true if page has the authentication. ',inject(function(){
			var samplePages=[{pageName : 'Serials',roles: ['admin']},{pageName : 'Search Serials',roles: ['admin']}];
			//Search Serials
			scope.pages=samplePages;
			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			//$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			var returnResult=scope.shouldRenderForSearchSerials();
			$httpBackend.flush();

			expect(returnResult).toEqualData(true);

			
		}));*/
		/* ********Note: the else part has not been covered in this function,
							 it has to be covered.
							 To covered the else part, the function need to be changed.
							 (need to add else part in the code of function)
				*******
			*/
/*	To test $scope.createSerial() function creates a serial successfully without any error and also with valid data.
*/
		it('$scope.createSerial() function should create a serial successfully without any error and also with valid data. ',inject(function(Serials,Serialactivitys){

			//sample post serial data.

			var locationVariable='A1B2';
			scope.ser={locationWarehouse:locationVariable,selectedProduct:'56c42cdec7153c68472afb9c',selectedSupplier:'56c1aceff2c91e8c09dc6338' ,serialNumber:'catan 1110' ,dateOfPurchase:'2016-02-17T00:00:00.000Z' ,warrantyPeriod:12 ,dateOfWarrantyExpiry:'2017-02-17T00:00:00.000Z' ,price:12500 ,acquisitionType:'Purchased' ,manufacturerSerialNumber:'c10' ,description:'testing data' };
			var statusDetail = ('Location in Warehouse : ' + locationVariable);
			
			var sampleSerialPostData = new Serials({
				product: '56c42cdec7153c68472afb9c',
				supplier: '56c1aceff2c91e8c09dc6338',
				serialNumber: 'catan 1110',
				dateOfPurchase: '2016-02-17T00:00:00.000Z',
				warrantyPeriod: 12,
				dateOfWarrantyExpiry: '2017-02-17T00:00:00.000Z',
				dateOfLastActivity : '2016-02-17T00:00:00.000Z',
				purchasePrice: 12500,
				depreciatedValue: 12500,
				residualValue:12500,
				acquisitionType: 'Purchased',
				manufacturerSerialNumber: 'c10',
				description: 'testing data',
				statusDetail: statusDetail,
				status:'In Stock'
			});
			var sampleSerialsPostData=[sampleSerialPostData];
			//sample serial response data.
			var sampleSerialResponseData = new Serials({
				_id: '525cf20451979dea2c000002',
				product: '56c42cdec7153c68472afb9c',
				supplier: '56c1aceff2c91e8c09dc6338',
				serialNumber: 'catan 1110',
				dateOfPurchase: '2016-02-17T00:00:00.000Z',
				warrantyPeriod: 12,
				dateOfWarrantyExpiry: '2017-02-17T00:00:00.000Z',
				dateOfLastActivity : '2016-02-27',
				purchasePrice: 12500,
				depreciatedValue: 12500,
				residualValue:12500,
				acquisitionType: 'Purchased',
				manufacturerSerialNumber: 'c10',
				description: 'testing data',
				statusDetail: statusDetail,
				status:'In Stock'
			});
			var sampleSerialsResponseData=[sampleSerialResponseData];

			//sample data for serial activity
			var serialactivityPostData = new Serialactivitys({
				serial : sampleSerialResponseData._id,
				dateOfActivity : sampleSerialResponseData.dateOfPurchase,
				depreciatedValue : sampleSerialResponseData.depreciatedValue,
				residualValue: sampleSerialResponseData.residualValue,
				status : sampleSerialResponseData.status,
				statusDetail : sampleSerialResponseData.statusDetail,
				description : sampleSerialResponseData.description
			});
			//sample response data for serial activity 
			var serialactivityResponseData = new Serialactivitys({
				_id : '525cf20451979dea2c000003',
				serial : sampleSerialResponseData._id,
				dateOfActivity : sampleSerialResponseData.dateOfPurchase,
				depreciatedValue : sampleSerialResponseData.depreciatedValue,
				residualValue: sampleSerialResponseData.residualValue,
				status : sampleSerialResponseData.status,
				statusDetail : sampleSerialResponseData.statusDetail,
				description : sampleSerialResponseData.description
			});
			//spyOn(scope, 'saveSerial');
			//spyOn(scope, 'saveSerial').and.returnValue(sampleSerialPostData,function(){},function(){});

			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.whenGET('serials').respond(serials);
			// Set POST response
			$httpBackend.expectPOST('serials', sampleSerialPostData).respond(sampleSerialResponseData);
			$httpBackend.whenPOST('serialactivitys', serialactivityPostData).respond(serialactivityResponseData);

			// Run controller functionality
			scope.createSerial();
			$httpBackend.flush();

			//expect(scope.saveSerial).toHaveBeenCalledWith(sampleSerialPostData,function(){},function(){});
			//expect(scope.saveSerial).toHaveBeenCalled();
			expect(scope.savedSerialSuccessfully).toEqualData(true);
		}));
/*	To test $scope.UpdateSerials() function updates the serial and serial activity successfully.
*/
		it('$scope.UpdateSerials() function should save serial and also update serial activity successfully. ',inject(function(Serials,Serialactivitys,TodaysDateWithoutMilliseconds){
			//serial object need to pass as a parameter for UpdateSerials() function.
			var serialToPass=serials[0];
			var statusDetail = ('Location in Warehouse : ' + serialToPass.locationWarehouse);

			var dateWithoutSeconds=TodaysDateWithoutMilliseconds;
			//spyOn(window, 'Date').and.returnValue('2017-02-17T00:00:00.000Z');

			//sample put data for serial 
			var sendSerial = new Serials({
				_id : serialToPass._id,
				depreciatedValue : serialToPass.depreciatedValue,
				residualValue : serialToPass.residualValue,
				description : serialToPass.description,
				statusDetail : statusDetail,
				//status :serialToPass.status,
				//dateOfPurchase: serialToPass.dateOfPurchase,
				dateOfLastActivity : dateWithoutSeconds//new Date()//newDate//'2017-02-17T00:00:00.000Z'
			});

			//sample post data for serial activity
			var samplePostSerialactivity = new Serialactivitys({
				serial : sendSerial._id,
				dateOfActivity : sendSerial.dateOfLastActivity,
				depreciatedValue : sendSerial.depreciatedValue,
				residualValue:sendSerial.residualValue,
				status : sendSerial.status,
				statusDetail : sendSerial.statusDetail,
				description : sendSerial.description
			});
			//sample response data for serial activity
			var sampleResponseSerialactivity = new Serialactivitys({
				_id : '525cf20451979dea2c000003',
				serial : sendSerial._id,
				dateOfActivity : sendSerial.dateOfLastActivity,
				depreciatedValue : sendSerial.depreciatedValue,
				residualValue:sendSerial.residualValue,
				status : sendSerial.status,
				statusDetail : sendSerial.statusDetail,
				description : sendSerial.description
			});

			
			/*spyOn(window, 'Date').andCallFake(function() {
      			return newDate;
    		});*/

			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.whenGET('serials').respond(serials);

			// Set PUT response
			$httpBackend.whenPUT(/serials\/([0-9a-fA-F]{24})$/).respond();
			// Set POST response
			$httpBackend.expectPOST('serialactivitys', samplePostSerialactivity).respond(201);

			//jasmine.clock().mockDate(new Date());

			// Run controller functionality
			scope.UpdateSerials(serialToPass);
			$httpBackend.flush();

			expect(scope.updatedSuccessfullySerial).toEqualData(true);

		}));
/*	To test $scope.sellSerial() function updates the serial status to sold and also save serial activity with status 
	sold successfully.
*/		
		it('$scope.sellSerial() function should updates the serial status to sold and also save the serial activity with status sold. ',inject(function(Serials,Serialactivitys,TodaysDateWithoutMilliseconds){
			scope.searchTextSerials={text: ''};
			scope.curPageSerial={currentPage:''};
			scope.curPageSerials={currentPages:''};

			var dateWithoutSeconds=TodaysDateWithoutMilliseconds;
			//sample object use to pass in $scope.pageChangedSerial() function as a parameter.
			//var product={id:''};
			scope.serialsOnPage=serials;
			scope.serials=serials;
			var serialToPass=serials[0];
			scope.sellSerialValue={soldTo: 'olx'};
			var statusDetail = ('Sold To: ' + scope.sellSerialValue.soldTo);
			//sample put data for serial 
			var sendSerial = new Serials({
				_id : serialToPass._id,
				depreciatedValue : serialToPass.depreciatedValue,
				residualValue :serialToPass.residualValue,
				description : serialToPass.description,
				statusDetail : statusDetail,
				status :'Sold',
				//dateOfPurchase: serialToPass.dateOfPurchase,
				dateOfLastActivity : dateWithoutSeconds//new Date()//'2016-03-01'
			});

			//sample post data for serial activity
			var samplePostSerialactivity = new Serialactivitys({
				serial : sendSerial._id,
				dateOfActivity : sendSerial.dateOfLastActivity,
				depreciatedValue : sendSerial.depreciatedValue,
				residualValue:sendSerial.residualValue,
				status : sendSerial.status,
				statusDetail : sendSerial.statusDetail,
				description : sendSerial.description
			});
			//sample response data for serial activity
			var sampleResponseSerialactivity = new Serialactivitys({
				_id : '525cf20451979dea2c000003',
				serial : sendSerial._id,
				dateOfActivity : sendSerial.dateOfLastActivity,
				depreciatedValue : sendSerial.depreciatedValue,
				residualValue:sendSerial.residualValue,
				status : sendSerial.status,
				statusDetail : sendSerial.statusDetail,
				description : sendSerial.description
			});

			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.whenGET('serials').respond(serials);

			// Set PUT response
			$httpBackend.whenPUT(/serials\/([0-9a-fA-F]{24})$/).respond();
			// Set POST response
			$httpBackend.expectPOST('serialactivitys', samplePostSerialactivity).respond(201);
			//Set Get response for serial for pagination
			$httpBackend.whenGET('serials?limit=10&page=1').respond(serials);
			$httpBackend.whenGET('serials/count?searchText=').respond(serials.length);
			$httpBackend.whenGET('serials?limit=10&page=1&searchText=').respond(serials);

			// Run controller functionality
			scope.sellSerial(serialToPass);
			$httpBackend.flush();

			expect(scope.updatedSuccessfullySerial).toEqualData(true);
			expect(scope.serialsOnPage.length).toEqualData(1);
		}));
/*	To test $scope.junkSerial() function updates serial to junk and also save serial activity with status 
	junk successfully.
*/
		it('$scope.junkSerial() should update serial to junk and also save serial activity with status junk successfully',inject(function(Serials,Serialactivitys,TodaysDateWithoutMilliseconds){
			scope.searchTextSerials={text: ''};
			scope.curPageSerial={currentPage:''};
			scope.curPageSerials={currentPages:''};

			var dateWithoutSeconds=TodaysDateWithoutMilliseconds;
			//sample object use to pass in $scope.pageChangedSerial() function as a parameter.
			//var product={id:''};
			scope.serialsOnPage=serials;
			scope.serials=serials;
			var serialToPass=serials[0];
			scope.junkSerialValue={junkTo: 'olx'};
			var statusDetail = ('Junked To: ' + scope.junkSerialValue.junkTo);
			//sample put data for serial 
			var sendSerial = new Serials({
				_id : serialToPass._id,
				depreciatedValue : 0,
				residualValue :serialToPass.residualValue,
				description : serialToPass.description,
				statusDetail : statusDetail,
				status :'Junked',
				//dateOfPurchase: serialToPass.dateOfPurchase,
				dateOfLastActivity : dateWithoutSeconds//new Date()//'2016-03-01'
			});

			//sample post data for serial activity
			var samplePostSerialactivity = new Serialactivitys({
				serial : sendSerial._id,
				dateOfActivity : sendSerial.dateOfLastActivity,
				depreciatedValue : sendSerial.depreciatedValue,
				residualValue:sendSerial.residualValue,
				status : sendSerial.status,
				statusDetail : sendSerial.statusDetail,
				description : sendSerial.description
			});
			//sample response data for serial activity
			var sampleResponseSerialactivity = new Serialactivitys({
				_id : '525cf20451979dea2c000003',
				serial : sendSerial._id,
				dateOfActivity : sendSerial.dateOfLastActivity,
				depreciatedValue : sendSerial.depreciatedValue,
				residualValue:sendSerial.residualValue,
				status : sendSerial.status,
				statusDetail : sendSerial.statusDetail,
				description : sendSerial.description
			});

			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			$httpBackend.whenGET('serials').respond(serials);

			// Set PUT response
			$httpBackend.whenPUT(/serials\/([0-9a-fA-F]{24})$/).respond();
			// Set POST response
			$httpBackend.expectPOST('serialactivitys', samplePostSerialactivity).respond(201);
			//Set Get response for serial for pagination
			$httpBackend.whenGET('serials?limit=10&page=1').respond(serials);
			$httpBackend.whenGET('serials/count?searchText=').respond(serials.length);
			$httpBackend.whenGET('serials?limit=10&page=1&searchText=').respond(serials);

			// Run controller functionality
			scope.junkSerial(serialToPass);
			$httpBackend.flush();

			expect(scope.updatedSuccessfullySerial).toEqualData(true);
			expect(scope.serialsOnPage.length).toEqualData(1);
		}));
/*	To test $scope.sellSerial() function return error if $scope.sellSerialValue.soldTo is blank.
*/
		it('$scope.sellSerial() should return a error if $scope.sellSerialValue.soldTo is blank.',inject(function(){
			scope.sellSerialValue={soldTo:''};
			var serialToPass=serials[0];
			//sample data for pages.
			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.sellSerial(serialToPass);
			$httpBackend.flush();

			expect(scope.errorUpdateSerial).toEqualData('Please Add Name Whom To Sold.');
		}));
/*	To test $scope.junkSerial() function return error if $scope.junkSerialValue.junkTo is blank.
*/
		it('$scope.junkSerial() should return a error if $scope.sellSerialValue.soldTo is blank.',inject(function(){
			scope.junkSerialValue={junkTo:''};
			var serialToPass=serials[0];
			//sample data for pages.
			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.junkSerial(serialToPass);
			$httpBackend.flush();

			expect(scope.errorUpdateSerial).toEqualData('Please Add Name Whom To Junk.');
		}));
/*	To test $scope.updateWarrantyExpiry() function updates warranty expiry date based on entered purchase date and 			warranty period.
*/
		it('$scope.updateWarrantyExpiry() should update the warranty expiry date correctly based on entered purchased date and warranty period. ',inject(function(){
			scope.ser={dateOfPurchase:'2016-02-17T00:00:00.000Z',warrantyPeriod:12};
			var dateofPurchaseEntered = scope.ser.dateOfPurchase;
			var warrantyPeriodEntered = scope.ser.warrantyPeriod;

			//sample data for pages.
			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.updateWarrantyExpiry();
			$httpBackend.flush();

			expect(scope.ser.dateOfWarrantyExpiry).toEqualData('2017-02-17');
		}));
/*	To test $scope.updateWarrantyPeriod() function to update warranty period correctly based on the 						this.ser.dateOfWarrantyExpiry value entered.
*/
		it('$scope.updateWarrantyPeriod() function should update warranty period correctly based on value of warranty expiry.',inject(function(){
			scope.ser={dateOfPurchase:'2016-02-17T00:00:00.000Z',dateOfWarrantyExpiry:'2017-02-17T00:00:00.000Z'};
			var dateOfWarrantyExpiryEntered = scope.ser.dateOfWarrantyExpiry;

			//sample data for pages.
			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.updateWarrantyPeriod();
			$httpBackend.flush();

			expect(scope.ser.warrantyPeriod).toEqualData(12);
		}));
/*	To test $scope.pageChangedSerial() function to return only those serial that belong to pass product only.
*/
		it('$scope.pageChangedSerial() function to return only those serial that belong to pass product only[product is pass as a parameter] ',inject(function(){
			var serialToPass=serials[0];
			scope.serials=serials;
			var product = serialToPass.product._id;
			scope.curPageSerial = {currentPage:1};
			scope.itemsPerPageHardCoded = 10; //hard coded in the current pagination
			scope.searchTextSerial = {text : ''};
			scope.maxSize = 5;
			//sample data for pages.
			var samplePages=[pages];
			scope.pages=samplePages;

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Run controller functionality
			scope.pageChangedSerial(product);
			$httpBackend.flush();

			expect(scope.serialsOnPage).toEqualData([serialToPass]);
		}));
/*	To test $scope.saveSerial() function create serial successfully without any error.

		it('$scope.saveSerial() function should save serial successfully with valid data. ',inject(function(Serials){
			var samplePages=[pages];
			scope.pages=samplePages;

			// var locationVariable='A1B2';
			// scope.ser={locationWarehouse:locationVariable,selectedProduct:'56c42cdec7153c68472afb9c',selectedSupplier:'56c1aceff2c91e8c09dc6338' ,serialNumber:'catan 1110' ,dateOfPurchase:'2016-02-17T00:00:00.000Z' ,warrantyPeriod:12 ,dateOfWarrantyExpiry:'2017-02-17T00:00:00.000Z' ,price:12500 ,acquisitionType:'Purchased' ,manufacturerSerialNumber:'c10' ,description:'testing data' };
			// var statusDetail = ('Location in Warehouse : ' + locationVariable);
			
			var sampleSerialPostData = new Serials({
				product: '56c42cdec7153c68472afb9c',
				supplier: '56c1aceff2c91e8c09dc6338',
				serialNumber: 'catan 1110',
				dateOfPurchase: '2016-02-17T00:00:00.000Z',
				warrantyPeriod: 12,
				dateOfWarrantyExpiry: '2017-02-17T00:00:00.000Z',
				dateOfLastActivity : '2016-02-17T00:00:00.000Z',
				purchasePrice: 12500,
				depreciatedValue: 12500,
				residualValue:12500,
				acquisitionType: 'Purchased',
				manufacturerSerialNumber: 'c10',
				description: 'testing data',
				statusDetail: 'Location in Warehouse :A1B2',
				status:'In Stock'
			});
			var sampleSerialsPostData=[sampleSerialPostData];
			//sample serial response data.
			var sampleSerialResponseData = new Serials({
				_id: '525cf20451979dea2c000002',
				product: '56c42cdec7153c68472afb9c',
				supplier: '56c1aceff2c91e8c09dc6338',
				serialNumber: 'catan 1110',
				dateOfPurchase: '2016-02-17T00:00:00.000Z',
				warrantyPeriod: 12,
				dateOfWarrantyExpiry: '2017-02-17T00:00:00.000Z',
				dateOfLastActivity : '2016-02-27',
				purchasePrice: 12500,
				depreciatedValue: 12500,
				residualValue:12500,
				acquisitionType: 'Purchased',
				manufacturerSerialNumber: 'c10',
				description: 'testing data',
				statusDetail: 'Location in Warehouse :A1B2',
				status:'In Stock'
			});
			var sampleSerialsResponseData=[sampleSerialResponseData];

			// Set GET response
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);
			$httpBackend.expectGET('pages').respond(samplePages);

			// Set POST response
			$httpBackend.expectPOST('serials', sampleSerialPostData).respond(sampleSerialResponseData);

			// Run controller functionality
			scope.saveSerial(sampleSerialPostData);
			$httpBackend.flush();

		}));*/
	});
}());