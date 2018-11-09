'use strict';

angular.module('products').controller('ProductsController', ['$scope', 'filterFilter', '$stateParams', '$location', 'Authentication', 'Products', 'Specvalues', 'Contentgroups', 'Contents', 'CategoriesService', 'Serials', 'Serialactivitys', '$q', '$mdDialog', 'Notification',
  function($scope, filterFilter, $stateParams, $location, Authentication, Products, Specvalues, Contentgroups, Contents, Categories, Serials, Serialactivitys, $q, $mdDialog, Notification) {
    $scope.authentication = Authentication;

    $scope.form = {};

    $scope.createProduct = function(component, callback) {

      if ($scope.prod.productNumber === '' || !$scope.prod.productNumber) {
        $scope.errorProduct = 'Please Fill Game Name Before Saving Game';
      } else if ($scope.categoryData.selectedItem === '' || !$scope.categoryData.selectedItem)
        $scope.errorProduct = 'Please Select Category Before Saving Game';
      else {
        var product = new Products({
          productName: $scope.prod.productName,
          productNumber: $scope.prod.productNumber,
          category: $scope.categoryData.selectedItem._id
        });
        product.component = component._id;
        // $scope.test = product;
        product.$save(function(response) {
          Notification.success('Game ' + $scope.prod.productNumber + ' is created');
          $scope.savedProductSuccessfully = true;
          $scope.errorProduct = '';
          // $scope.category = '';
          $scope.clearProduct();
          $scope.products = Products.query(function() {
            $scope.specvalues = Specvalues.query(function() {
              $scope.pageChangedProd(component, $scope.searchTextProd.txt);
            });
            // console.log($scope.products);
          });

          // $scope.productForm.$setPristine();
          // $scope.productForm.productNumber.$touched = false;
          // $scope.productForm.productNumber.$valid = false;
          if (callback) callback();
        }, function(errorResponse) {
          $scope.errorProduct = errorResponse.data.message;
          $scope.savedProductSuccessfully = '';
          Notification.error($scope.errorProduct);
        });
      }
    };

    $scope.clearProduct = function() {
      $scope.prod.productName = '';
      $scope.prod.productNumber = '';
      $scope.categoryData.selectedItem = '';
    };

    $scope.queryCategoryData = function(searchTexts) {
      // console.log(searchTexts);
      var deferred = $q.defer();
      Categories.query({ categoryName: searchTexts }, function(results) {
        // console.log(results);
        deferred.resolve(results);
      }, function(err) {
        deferred.reject('Error in connectivity with server! ' + err.data.message);
      });

      return deferred.promise;
    };

/** *************************************************Basic Fuctions*************************************/
    $scope.find = function() {
      // pageAuthentication.shouldRender('Games').then(function(res){
          // $scope.test=res;
          // $scope.productPageVisible=res;
      $scope.productPageVisible = true;
      //  });
      /* $scope.pages=Pages.query(function(){
        $scope.productPageVisible = $scope.shouldRender();
      }); */
      // $scope.products = Products.query();
      // $scope.contentgroups = Contentgroups.query;
      // $scope.products = Products.query(function() {
      $scope.limit = 10;
      $scope.currentPageAll = { page: 1 };
      $scope.searchTextProdAll = { text: '' };
      $scope.maxSize = 5;
      // $scope.pageChangedProdForAll($scope.searchTextProdAll.text);
      //  $scope.itemsPerPageHardCoded = 10; //hard coded in the current pagination
      //  $scope.itemsPerPageHardCodedForAll = 10; //hard coded in the current pagination
      //  $scope.curPageProduct = {currentPage:1};
      //  $scope.curPageProductAll = {currentPageAll:1};
      //  $scope.searchTextProd = {text : ''};
      //  $scope.searchTextProdAll = {text : ''};
      //  $scope.maxSizeForAllProd = 5;
      //  $scope.maxSize = 5;
      //  $scope.pageChangedProdForAll();
        // $scope.limit = 10;
      $scope.curPageProduct = { page: 1 };
      $scope.searchTextProd = { text: '' };
        // $scope.maxSize = 5;
        // $scope.pageChangedProd($scope.searchTextProd.text);
      // });

      $scope.categoryData = { selectedItem: '' };
      $scope.searchText = '';

      $scope.specvalues = Specvalues.query();
      $scope.categories = Categories.query();
      $scope.prod = { productName: '', productNumber: '' /* , category : '' */};
      $scope.addProductclicked = false;
      $scope.savedProductSuccessfully = false;
      $scope.IsVisible = false;
      $scope.IsDisabled = true;
      $scope.conGrp = { contentGroup: '' };
      $scope.con = { contentName: '', numberOfItems: '' };
      $scope.contents = Contents.query(function() {
        $scope.queryContentgroups();
      });
    };

    $scope.findOne = function() {
      $scope.product = Products.get({
        productId: $stateParams.productId
      });
    };

    $scope.refreshContents = function() {
      $scope.contents = Contents.query(function() {
        $scope.queryContentgroups();
      });
    };

/** ********************************* User Role coding  ****************************************/
    /* $scope.shouldRender=function(){
        for (var p in $scope.pages)
          if ($scope.pages[p].pageName === 'Games'){
            $scope.page = $scope.pages[p];
            break;
          }

        for (var i in $scope.authentication.user.roles) {
          for (var j in $scope.page.roles) {
            if ($scope.page.roles[j] === $scope.authentication.user.roles[i]) {
              return true;
            }
          }
        }
    return false;
    }; */

/** ********************************************Content Group****************************************************/
    $scope.queryContentgroups = function() {
      $scope.contentgroups = Contentgroups.query(function() {
        $scope.updateContentGrpTotal();
      });
    };

    $scope.updateContentGrpTotal = function() {
      for (var i = 0; i < $scope.contentgroups.length; i++) {
        $scope.contentgroups[i].contentButtonClick = true;
        $scope.contentgroups[i].totalItems = 0;
        for (var j = 0; j < $scope.contents.length; j++) {
          if ($scope.contentgroups[i]._id === $scope.contents[j].contentgroup) {
            $scope.contentgroups[i].totalItems += $scope.contents[j].numberOfItems;
          }
        }
      }
    };

    $scope.focusProduct = function() {
      $scope.errorProduct = false;
      $scope.savedProductSuccessfully = false;
    };

    $scope.focusProductUpd = function() {
      $scope.updatedSuccessfullyProduct = false;
      $scope.errorUpdPro = false;
    };

    $scope.clickProduct = function(product) {
      if ($scope.activeProduct === product._id) {
        $scope.prod.updateProdNum = '';
        product.editingProductName = false;
        $scope.activeProduct = '';
      } else {
        $scope.activeProduct = product._id;
        $scope.activeProductNumber = product.productNumber;
      }

      // console.log($scope.products);
      $scope.products = Products.query();
      for (var i = 0; i < $scope.products.length; i++) {
        $scope.products[i].editingProductName = false;
      }
      $scope.focusProduct();
      $scope.focusProductUpd();
    };

    $scope.clickContentGrp = function(contentgroup) {
      if ($scope.activeContentgroup === contentgroup._id)
        $scope.activeContentgroup = '';
      else {
        $scope.activeContentgroup = contentgroup._id;
        $scope.activeContentGroupName = contentgroup.contentGroupName;
      }
      $scope.focusContentGroup();
      $scope.focusContentGroupUpdt();
      $scope.clearContent();
      contentgroup.contentButtonClick = false;
      for (var i = 0; i < $scope.contentgroups.length; i++) {
        $scope.contentgroups[i].editContentgroupNameClicked = false;
      }
    };

    $scope.clearActiveProduct = function() {
      $scope.activeProduct = '';
    };

    $scope.addProductbuttonclicked = function() {
      $scope.addProductclicked = !$scope.addProductclicked;
      $scope.focusProduct();
    };
/** ***********************************************contents coding*****************************************************/

    $scope.addContentGroupButtonClicked = function() {
      $scope.contentGroupButtonClick = !$scope.contentGroupButtonClick;
      $scope.focusContentGroup();
      $scope.clearContentGroup();
    };

    $scope.addContentButtonClicked = function(contentgroupId) {
      for (var i = 0; i < $scope.contentgroups.length; i++)
        if ($scope.contentgroups[i]._id === contentgroupId) {
          $scope.contentgroups[i].contentButtonClick = !$scope.contentgroups[i].contentButtonClick;
        } else {
          $scope.contentgroups[i].contentButtonClick = false;
        }
      $scope.focusContent();
      $scope.clearContent();
    };

/** *****************************************Create content group********************************************************/

    $scope.createContentGroup = function(product) {
      var contentGroup = new Contentgroups({
        contentGroupName: $scope.conGrp.contentGroup
      });

      contentGroup.product = product._id;

      contentGroup.$save(function(response) {
        $scope.queryContentgroups();
        $scope.savedContentGroupSuccessfully = true;
        $scope.errorContentGroup = '';
        $scope.clearContentGroup();
      }, function(errorResponse) {
        $scope.errorContentGroup = errorResponse.data.message;
        $scope.savedContentGroupSuccessfully = '';
      });
    };

    $scope.contentGrpRemove = function(contentgroup) {
      if (contentgroup._id) {
        contentgroup.$remove();
        for (var i = 0; i < $scope.contentgroups.length; i++) {
          if ($scope.contentgroups[i]._id === contentgroup._id) {
            $scope.contentgroups.splice(i, 1);
            // $scope.updateContentGrpTotal();
          }
        }
        for (var j = 0; j < $scope.contents.length; j++) {
          if ($scope.contents[j].contentgroup === contentgroup._id) {
            $scope.contents[j].$remove();
            $scope.contents.splice(j, 1);
          }
        }
      }
    };

    $scope.alertDeleteCtnGrp = function(ev, contentgroup) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
          .title('Are you sure you want to Delete ' + contentgroup.contentGroupName + '?')
          .textContent('You have clicked the trash button for a Content Group.')
          .ariaLabel('Content Group Delete Confirmation!')
          .targetEvent(ev)
          .ok('Yes Please Delete!')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        $scope.contentGrpRemove(contentgroup);
        $scope.status = 'You decided to confirm delete.'; // replace with notification
      }, function() {
        $scope.status = 'You cancelled delete confirmation.'; // replace with notification
      });

      // var d = window.confirm('Are You Sure To Delete!');
      //     if (d === true){
      //       $scope.contentGrpRemove(contentgroup);
      //     }
    };

    $scope.updateContentGroup = function(contentgroup) {
      contentgroup.contentGroupName = $scope.conGrp.contgrpName;
      var sendContentgroup = new Contentgroups({
        _id: contentgroup._id,
        contentGroupName: contentgroup.contentGroupName,
        user: $scope.authentication.user._id,
        created: Date.now()
      });

      sendContentgroup.$update(function() {
        $scope.updatedSuccessfullyContentgroup = true;
        contentgroup.editContentgroupNameClicked = false;
      }, function(errorResponse) {
        contentgroup.contentGroupName = $scope.activeContentGroupName;
        if (errorResponse.data.message === 'ContentGroupName already exists')
          $scope.errorCtnGrp = 'Content Group Name Already Exists';
        else $scope.errorCtnGrp = errorResponse.data.message;
      });
    };

    $scope.editContentgroupButtonClicked = function(contentgroup) {
      $scope.conGrp.contgrpName = contentgroup.contentGroupName;
      contentgroup.editContentgroupNameClicked = true;
      $scope.focusContentGroup();
      $scope.focusContentGroupUpdt();
    };

/** ****************************************************Create content**************************************************/

    $scope.createContent = function(contentgroup) {
      var content = new Contents({
        contentName: $scope.con.contentName,
        numberOfItems: $scope.con.numberOfItems
      });

      content.contentgroup = contentgroup._id;

      content.$save(function(response) {
        $scope.contents = Contents.query(function() { $scope.updateContentGrpTotal(); });
        $scope.savedContentSuccessfully = true;
        $scope.errorContent = '';
        $scope.clearContent();
      }, function(errorResponse) {
        $scope.errorContent = errorResponse.data.message;
        $scope.savedContentSuccessfully = '';
      });
    };

    $scope.contentRemove = function(content) {
      if (content._id) {
        content.$remove();
        for (var i = 0; i < $scope.contents.length; i++) {
          if ($scope.contents[i]._id === content._id) {
            $scope.contents.splice(i, 1);
            $scope.updateContentGrpTotal();
          }
        }
      }
    };

    $scope.alertDeleteCtn = function(ev, content) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
          .title('Are you sure you want to Delete ' + content.contentName + '?')
          .textContent('You have clicked the trash button for a Content.')
          .ariaLabel('Content Delete Confirmation!')
          .targetEvent(ev)
          .ok('Yes Please Delete!')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        $scope.contentRemove(content);
        $scope.status = 'You decided to confirm delete.'; // replace with notification
      }, function() {
        $scope.status = 'You cancelled delete confirmation.'; // replace with notification
      });

      // var f = window.confirm('Are You Sure To Delete!');
      //     if (f === true){
      //       $scope.contentRemove(content);
      //     }
    };

/** ***********************************************Clear Functions*******************************************************/

    $scope.clearContent = function() {
      $scope.con.contentName = '';
      $scope.con.numberOfItems = '';
    };
    $scope.clearContentGroup = function() {
      $scope.conGrp.contentGroup = '';
    };

/** ************************************************Focus Functions******************************************************/
    $scope.focusContentGroup = function() {
      $scope.savedContentGroupSuccessfully = false;
      $scope.errorContentGroup = false;
    };

    $scope.focusContentGroupUpdt = function() {
      $scope.updatedSuccessfullyContentgroup = false;
      $scope.errorCtnGrp = false;
    };

    $scope.focusContent = function() {
      $scope.savedContentSuccessfully = false;
      $scope.errorContent = false;
    };

    $scope.deactivateProduct = function(ev, product, component) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
          .title('Are you sure you want to Delete ' + product.productName + '?')
          .textContent('You have clicked the trash button for a product.')
          .ariaLabel('Product Delete Confirmation!')
          .targetEvent(ev)
          .ok('Yes Please Delete!')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        product.active = false;
        product.$update(function() {
          $scope.deactivateSerials(product);
          $scope.pageChangedProd(component, $scope.searchTextProd.txt);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        $scope.status = 'You decided to confirm delete product.'; // replace with notification
      }, function() {
        $scope.status = 'You cancelled delete product confirmation.'; // replace with notification
      });

      // var d = window.confirm('Are You Sure You Want To Delete!');
      //    if (d === true) {
      //      product.active = false;

      //      product.$update(function() {
      //        $scope.deactivateSerials(product);
      //        $scope.pageChangedProd(component, $scope.searchTextProd.txt);
      //      }, function(errorResponse) {
      //        $scope.error = errorResponse.data.message;
      //     });
      //    }

      // $scope.products = Products.query();
    };

    $scope.deactivateSerials = function(product) {
      $scope.serials = Serials.query(function() {
        for (var j = 0; j < $scope.serials.length; j++) {
          if ($scope.serials[j].product._id === product._id) {
            $scope.uptadeSerial($scope.serials[j]._id);
          }
        }
      });
    };

    $scope.uptadeSerial = function(serial) {
      var sendSerial = new Serials({
        _id: serial,
        depreciatedValue: 0,
        residualValue: serial.residualValue,
        status: 'Junked',
        dateOfLastActivity: new Date()
      });
      sendSerial.$update(function() {
        $scope.serialactivitys = Serialactivitys.query(function() {
          // $scope.junkSerialActivity(sendSerialdeactivateProduct);
          $scope.junkSerialActivity(sendSerial);
        });
      });
    };

    $scope.junkSerialActivity = function(sendSerial) {
      var serialactivity = new Serialactivitys({
        serial: sendSerial._id,
        depreciatedValue: sendSerial.depreciatedValue,
        residualValue: sendSerial.residualValue,
        status: 'Junked',
        dateOfActivity: sendSerial.dateOfLastActivity
      });
      serialactivity.$save();
    };

    $scope.CreateSpecvalueString = function () {
      for (var i = 0; i < $scope.products.length; i++) {
        var specvalueStringTemp = '';
        for (var j = 0; j < $scope.specvalues.length; j++) {
          if ($scope.specvalues[j].product._id === $scope.products[i]._id)
            specvalueStringTemp = specvalueStringTemp + '\n' + $scope.specvalues[j].specdesc.specificationDescription + ' : ' + $scope.specvalues[j].specificationValue;
        }
        $scope.products[i].specvalueString = specvalueStringTemp;
      }
    };

    $scope.updateSpecValues = function(activeProduct) {
      for (var i = 0; i < $scope.specvalues.length; i++) {
        if ($scope.specvalues[i].product.productNumber.toString() === activeProduct.toString()) {
          var specvalue = $scope.specvalues[i];
          $scope.updateSpecValue(specvalue);
        }
      }
      $scope.editable();
      $scope.enable();
    };

    $scope.updateProd = function(product) {
      product.productNumber = $scope.prod.updateProdNum;
      var sendProduct = new Products({
        _id: product._id,
        productNumber: product.productNumber,
        user: $scope.authentication.user._id,
        created: Date.now()
      });

      sendProduct.$update(function() {
        $scope.updatedSuccessfullyProduct = true;
        product.editingProductName = false;
        $scope.focusProduct();
        $scope.editable();
        $scope.enable();
      }, function(errorResponse) {
        product.productNumber = $scope.activeProductNumber;
        if (errorResponse.data.message === 'ProductNumber already exists')
          $scope.errorUpdPro = 'Game Name Already Exists ';
        else if (errorResponse.data.message === 'Product Number cannot be blank')
          $scope.errorUpdPro = 'Game Name cannot be blank';
        else $scope.errorUpdPro = errorResponse.data.message;
      });
    };

    $scope.updateSpecValue = function(specvalue) {

      var sendSpecValue = new Specvalues({
        _id: specvalue._id,
        user: specvalue.user._id,
        specdesc: specvalue.specdesc._id,
        product: specvalue.product._id,
        __v: specvalue.__v,
        created: Date.now(),
        specificationValue: specvalue.specificationValue
      });

      sendSpecValue.$update(function() {
        $scope.updatedSuccessfullySpecValue = true;
      }, function(errorResponse) {
        $scope.errorSpecValue = errorResponse.data.message;
      });
      // product.editingProductName = false;
      // $scope.focusProduct();
      // $scope.editable();
      // $scope.enable();
    };

    $scope.updateProductCategory = function(product) {
      product.$update(function() {
        $scope.updatedSuccessfullySpecValue = true;
      }, function(errorResponse) {
        $scope.errorSpecValue = errorResponse.data.message;
      });
    };

    $scope.focusSpecValue = function() {
      $scope.errorSpecValue = false;
      $scope.updatedSuccessfullySpecValue = false;
    };

    $scope.getComponentforProduct = function(product) {
      for (var i = 0; i < $scope.products.length; i++)
        if ($scope.products[i]._id === product) {
          return $scope.products[i].component;
        }
    };

    $scope.editProductButtonClicked = function(product) {
      $scope.prod.updateProdNum = product.productNumber;
      product.editingProductName = true;
      $scope.focusProduct();
      $scope.focusProductUpd();
      $scope.editable();
      $scope.enable();
    };

    $scope.editable = function() {
      // $scope.IsVisible = $scope.IsVisible ? false : true;
      $scope.IsVisible = !$scope.IsVisible;
    };

    // $scope.IsVisible ? false : true;

    $scope.enable = function() {
      // $scope.IsDisabled = $scope.IsDisabled ? false : true;
      $scope.IsDisabled = !$scope.IsDisabled;
    };

    // $scope.IsDisabled ? false : true;

    $scope.cancel = function (product) {
      // console.log('called');
      $scope.prod.updateProdNum = '';
      product.editingProductName = false;
      $scope.editable();
      $scope.enable();
    };

/** **********************************************pagination*******************************************************/
    $scope.pageChangedProd = function(component, searchText) {
    // console.log(component);
    // $scope.productsInComponent = filterFilter($scope.products, { component: component._id, active: true });

      $scope.getproductsInComponent = Products.get({ productId: 'count', component: component._id, productNumber: searchText }, function() {
        $scope.totalItemsProduct = $scope.getproductsInComponent;
        // console.log('called');
        // $scope.test4 ='WorK';scope
        $scope.productsOnPage = Products.query({ component: component._id, page: $scope.curPageProduct.page, limit: $scope.limit, productNumber: searchText }, function() {
          $scope.indexStartProd = ($scope.curPageProduct.page - 1) * $scope.limit;
          $scope.indexEndProd = Math.min(($scope.curPageProduct.page) * $scope.limit, $scope.totalItemsProduct.count);
        });
      });

    // $scope.productsInComponentWithSearchText = filterFilter ( $scope.productsInComponent, { productName: searchText} );
    // $scope.productsInComponentWithSearchNumber = filterFilter ( $scope.productsInComponent, { productNumber: searchText} );

    // for (var i=0; i< $scope.productsInComponentWithSearchNumber.length; i++) {
    //  if ($scope.productsInComponentWithSearchText.indexOf($scope.productsInComponentWithSearchNumber[i])<0) {  // element doesn't exist inside '$scope.productsInComponentWithSearchText' array
    //    $scope.productsInComponentWithSearchText.push($scope.productsInComponentWithSearchNumber[i]);
    //  }
    // }

    // $scope.totalItemsProduct = $scope.productsInComponentWithSearchText.length;
    // $scope.productsOnPage = [];

    //  $scope.indexStartProd = ($scope.curPageProduct.currentPage- 1) * $scope.itemsPerPageHardCoded ;
    //  $scope.indexEndProd = Math.min( ($scope.curPageProduct.currentPage) * $scope.itemsPerPageHardCoded, $scope.productsInComponentWithSearchText.length) ;

    // for ( i=(($scope.curPageProduct.currentPage- 1)*$scope.itemsPerPageHardCoded ) ; i < Math.min(($scope.curPageProduct.currentPage) * $scope.itemsPerPageHardCoded, $scope.productsInComponentWithSearchText.length) ; i++){
    //  $scope.productsOnPage.push($scope.productsInComponentWithSearchText[i]);
    // }
    };

/** **********************************************pagination for all product*******************************************************/
    $scope.pageChangedProdForAll = function(searchText) {
      // console.log(searchText);

      $scope.getProductCount = Products.get({ productId: 'count', productNumber: searchText }, function() {
        $scope.totalItemsAllProduct = $scope.getProductCount;

      // $scope.test4 ='WorK';
        $scope.allProductsOnPage = Products.query({ page: $scope.currentPageAll.page, limit: $scope.limit, productNumber: searchText }, function() {
          $scope.indexStartProdAll = ($scope.currentPageAll.page - 1) * $scope.limit;
          $scope.indexEndProdAll = Math.min(($scope.currentPageAll.page) * $scope.limit, $scope.totalItemsAllProduct.count);
        });
      });

    // $scope.allProducts = filterFilter($scope.products, {active: true });
    // $scope.allProductsWithSearchText = filterFilter ( $scope.allProducts, { productName: searchText} );

    // $scope.allProductsWithSearchNumber = filterFilter ( $scope.allProducts, { productNumber: searchText} );

    // for (var i=0; i< $scope.allProductsWithSearchNumber.length; i++) {
    //  if ($scope.allProductsWithSearchText.indexOf($scope.allProductsWithSearchNumber[i])<0) {

    //    $scope.allProductsWithSearchText.push($scope.allProductsWithSearchNumber[i]);
    //  }
    // }

    // $scope.totalItemsAllProduct = $scope.allProductsWithSearchText.length;
    // $scope.allProductsOnPage = [];

    //  $scope.indexStartProdAll = ($scope.curPageProductAll.currentPageAll- 1) * $scope.itemsPerPageHardCodedForAll ;
    //  $scope.indexEndProdAll = Math.min( ($scope.curPageProductAll.currentPageAll) * $scope.itemsPerPageHardCodedForAll, $scope.allProductsWithSearchText.length) ;

    // for ( i=(($scope.curPageProductAll.currentPageAll- 1)*$scope.itemsPerPageHardCodedForAll ) ; i < Math.min(($scope.curPageProductAll.currentPageAll) * $scope.itemsPerPageHardCodedForAll, $scope.allProductsWithSearchText.length) ; i++){
    //  $scope.allProductsOnPage.push($scope.allProductsWithSearchText[i]);

    // }

    // $scope.testingPagination=!$scope.testingPagination;
    };

  }

]);

