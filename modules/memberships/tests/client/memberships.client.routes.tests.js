(function () {
  'use strict';

  describe('Memberships Route Tests', function () {
    // Initialize global variables
    var $scope,
      MembershipsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MembershipsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MembershipsService = _MembershipsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('memberships');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/memberships');
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
          MembershipsController,
          mockMembership;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('memberships.view');
          $templateCache.put('modules/memberships/client/views/view-membership.client.view.html', '');

          // create mock Membership
          mockMembership = new MembershipsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Membership Name'
          });

          // Initialize Controller
          MembershipsController = $controller('MembershipsController as vm', {
            $scope: $scope,
            membershipResolve: mockMembership
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:membershipId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.membershipResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            membershipId: 1
          })).toEqual('/memberships/1');
        }));

        it('should attach an Membership to the controller scope', function () {
          expect($scope.vm.membership._id).toBe(mockMembership._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/memberships/client/views/view-membership.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MembershipsController,
          mockMembership;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('memberships.create');
          $templateCache.put('modules/memberships/client/views/form-membership.client.view.html', '');

          // create mock Membership
          mockMembership = new MembershipsService();

          // Initialize Controller
          MembershipsController = $controller('MembershipsController as vm', {
            $scope: $scope,
            membershipResolve: mockMembership
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.membershipResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/memberships/create');
        }));

        it('should attach an Membership to the controller scope', function () {
          expect($scope.vm.membership._id).toBe(mockMembership._id);
          expect($scope.vm.membership._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/memberships/client/views/form-membership.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MembershipsController,
          mockMembership;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('memberships.edit');
          $templateCache.put('modules/memberships/client/views/form-membership.client.view.html', '');

          // create mock Membership
          mockMembership = new MembershipsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Membership Name'
          });

          // Initialize Controller
          MembershipsController = $controller('MembershipsController as vm', {
            $scope: $scope,
            membershipResolve: mockMembership
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:membershipId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.membershipResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            membershipId: 1
          })).toEqual('/memberships/1/edit');
        }));

        it('should attach an Membership to the controller scope', function () {
          expect($scope.vm.membership._id).toBe(mockMembership._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/memberships/client/views/form-membership.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
