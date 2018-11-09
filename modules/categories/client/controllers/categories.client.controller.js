(function () {
  'use strict';

  // Categories controller
  angular
    .module('categories')
    .controller('CategoriesController', CategoriesController);

  CategoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'categoryResolve', 'filterFilter', 'CategoriesService', 'Notification', 'SystemparametersService'];

  function CategoriesController ($scope, $state, $window, Authentication, category, filterFilter, CategoriesService, Notification, SystemparametersService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.category = category;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    // vm.save = save;
    $scope.initialize = function() {
      $scope.limit = 10;
      $scope.curPageCategory = { page: 1 };
      $scope.searchTextCategory = { text: '' };
      $scope.maxSize = 5;
      $scope.pageChangedCategory($scope.searchTextCategory.txt);
      // vm.searchCategory = '';
      vm.editing = false;
      vm.cat = {
        categoryName: '',
        ratePerHourWeekday: '',
        ratePerHourWeekendHoliday: ''
      };
      $scope.systemparameters = SystemparametersService.query(function() {
        $scope.currencySymbol = (filterFilter($scope.systemparameters, { systemParameterName: 'Currency Symbol' }, true)).pop().value;
        vm.currencySymbol = $scope.currencySymbol;
        $scope.memMonthlyAmnt = (filterFilter($scope.systemparameters, { systemParameterName: 'Membership Monthly Amount' }, true)).pop().value;
        // $scope.serviceTax = (filterFilter($scope.systemparameters, { systemParameterName: 'Service Tax' }, true)).pop().value;
        $scope.gameCgstTaxParameter = (filterFilter($scope.systemparameters, { systemParameterName: 'Game CGST' }, true)).pop().value;
        $scope.gameSgstTaxParameter = (filterFilter($scope.systemparameters, { systemParameterName: 'Game SGST' }, true)).pop().value;
        $scope.gameGstSum = Number($scope.gameCgstTaxParameter + $scope.gameSgstTaxParameter);
        $scope.allTaxIncluded = (filterFilter($scope.systemparameters, { systemParameterName: 'Tax included in price' }, true)).pop().value;
        $scope.addressOnBill = (filterFilter($scope.systemparameters, { systemParameterName: 'Address on Bill' }, true)).pop().value;
        if ($scope.allTaxIncluded === 'Y') {
          $scope.chargeMultiplierWithoutFood = 1 / (1 + $scope.gameGstSum / 100);
        } else {
          $scope.chargeMultiplierWithoutFood = 1;
        }
      });
      vm.edit = { categoryName: '', ratePerHourWeekday: '', ratePerHourWeekendHoliday: '' };
      // categoryPagination(vm.searchCategory);
    };
    // Remove existing Category
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.category.$remove($state.go('categories.list'));
      }
    }

    // Save Category
    $scope.createCategory = function() {
      var category = new CategoriesService({
        categoryName: $scope.cat.categoryName,
        ratePerHourWeekday: $scope.cat.ratePerHourWeekday,
        ratePerHourWeekendHoliday: $scope.cat.ratePerHourWeekendHoliday
      });
      category.$save(function(response) {
        $scope.categoryForm.$setPristine();
        $scope.categoryForm.categoryName.$touched = false;
        $scope.categoryForm.categoryName.$valid = false;
        $scope.categoryForm.ratePerHourWeekday.$touched = false;
        $scope.categoryForm.ratePerHourWeekday.$valid = false;
        $scope.categoryForm.ratePerHourWeekendHoliday.$touched = false;
        $scope.categoryForm.ratePerHourWeekendHoliday.$valid = false;
        $scope.savedCategorySuccessfully = true;
        $scope.cat.categoryName = '';
        $scope.cat.ratePerHourWeekday = '';
        $scope.cat.ratePerHourWeekendHoliday = '';
        $scope.errorCategory = '';
        Notification.success('Category ' + $scope.cat.categoryName + ' is created');
        $scope.pageChangedCategory($scope.searchTextCategory.txt);
        // categoryPagination(vm.searchCategory);
      }, function(errorResponse) {
        $scope.errorCategory = errorResponse.data.message;
        // $scope.savedCategorySuccessfully = '';
        Notification.error($scope.errorCategory);
      });
    };

    vm.deleteCategory = function(category) {
      if ($window.confirm('Are you sure you want to delete category by Name: ' + category.categoryName + ' ?')) {
        category.active = false;
        category.$update(function (response) {
          // $setPristine();
          // categoryPagination(vm.searchCategory);
          $scope.pageChangedCategory($scope.searchTextCategory.txt);
          Notification.success('Category by Name ' + response.categoryName + ' is Delete successfully !');
        }, function (errorResponse) {
          console.log(errorResponse);
          vm.errorCategory = errorResponse.data.message;
          Notification.error(vm.errorCategory);
        });
      }
    };

    vm.clickCategory = function(category) {
      if (vm.activeCategoryId === category._id) {
        vm.activeCategoryId = '';
      // vm.editing = true;
      } else {
        vm.editing = false;
        vm.activeCategoryId = category._id;
        vm.edit.categoryName = category.categoryName;
        vm.edit.ratePerHourWeekday = category.ratePerHourWeekday;
        vm.edit.ratePerHourWeekendHoliday = category.ratePerHourWeekendHoliday;
      }
    };

    vm.editCategory = function(category) {
      vm.editing = true;
      vm.edit.categoryName = category.categoryName;
      vm.edit.ratePerHourWeekday = category.ratePerHourWeekday;
      vm.edit.ratePerHourWeekendHoliday = category.ratePerHourWeekendHoliday;
    };
    vm.cancelEditCategory = function(category) {
      vm.editing = false;
      vm.edit.categoryName = category.categoryName;
      vm.edit.ratePerHourWeekday = category.ratePerHourWeekday;
    };

    vm.updateCategory = function(category) {
      vm.editing = false;

      category.categoryName = vm.edit.categoryName;
      category.ratePerHourWeekday = vm.edit.ratePerHourWeekday;
      category.ratePerHourWeekendHoliday = vm.edit.ratePerHourWeekendHoliday;

      category.$update(function (updatedCategory) {
        Notification.success('Category by Name ' + updatedCategory.categoryName + ' is Updated successfully !');
      }, function (errorResponse) {
        vm.errorCategory = errorResponse.data.message;
        Notification.error(vm.errorCategory);
      });
    };


    /* function categoryPagination(searchCategory) {
      CategoriesService.query({ categoryName: searchCategory }, function(res) {
        vm.categories = res;
      });
    }*/

    $scope.pageChangedCategory = function(searchText) {
      $scope.getCategoryCount = CategoriesService.get({ categoryId: 'count', categoryName: searchText }, function() {
        $scope.totalItemsCategory = $scope.getCategoryCount;
        $scope.categoriesOnPage = CategoriesService.query({ page: $scope.curPageCategory.page, limit: $scope.limit, categoryName: searchText }, function() {
          $scope.indexStartCategory = ($scope.curPageCategory.page - 1) * $scope.limit;
          $scope.indexEndCategory = Math.min(($scope.curPageCategory.page) * $scope.limit, $scope.totalItemsCategory.count);
        });
      });
    };

    /* function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.category._id) {
        vm.category.$update(successCallback, errorCallback);
      } else {
        vm.category.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('categories.view', {
          categoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }*/
  }
}());
