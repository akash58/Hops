// Configuring the Serials module

(function () {
  'use strict';

  angular
    .module('foodoperations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'pageAuthentication'];

  function menuConfig(menuService, pageAuthentication) {

    pageAuthentication.getRoles(['Food Operations', 'Purchase Orders', 'Stock Audits', 'Food Expirys'])
      // .then(pageAuthentication.getRoles('Games'))
      // .then(pageAuthentication.getRoles('Serials'))
      .then(function(rolesArray) {
        // console.log(rolesArray.length);
        var mergedRoles = [];
        for (var i = 0; i < rolesArray.length; i++) {
          mergedRoles = angular.extend(mergedRoles, rolesArray[i]);
        }


        // Menus.addMenuItem('topbar', 'Food Operations', 'foodoperationsMenuItem','dropdown', 'foodoperations', 4,rolesVisibleAll);
        // Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Food Operations Overview', 'foodoperations','foodoperations',rolesVisibleFoodOperations);
        // Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Purchase Orders', 'purchaseorders', 'purchaseorders',rolesVisiblePurchaseOrders);
        // Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Stock Audit', 'stockaudits', 'stockaudits',rolesVisibleStockAudits);
        // Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Food Expiries', 'foodexpirys', 'foodexpirys',rolesVisibleFoodExpirys);
        menuService.addMenuItem('topbar', {
          position: 3,
          title: 'Food Operations',
          state: 'foodoperations',
          type: 'dropdown',
          roles: mergedRoles
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'foodoperations', {
          title: 'Food Operations',
          state: 'FoodOperations',
          roles: rolesArray[0]
        });

        menuService.addSubMenuItem('topbar', 'foodoperations', {
          title: 'Purchase Orders',
          state: 'purchaseorders.create',
          roles: rolesArray[1]
        });

        menuService.addSubMenuItem('topbar', 'foodoperations', {
          title: 'Stock Audit',
          state: 'stockaudits.create',
          roles: rolesArray[2]
        });

        menuService.addSubMenuItem('topbar', 'foodoperations', {
          title: 'Food Expiries',
          state: 'listFoodExpirys',
          roles: rolesArray[3]
        });
      });
  }
}());

// 'use strict';

// Configuring the Serials module
/* angular.module('foodoperations').run(['Menus','pageAuthentication',
  function(Menus,pageAuthentication) {

    var rolesVisibleAll = [];
    var rolesVisiblePurchaseOrders = [];
    var rolesVisibleFoodOperations = [];
    var rolesVisibleStockAudits = [];
    var rolesVisibleFoodExpirys = [];

    pageAuthentication.getRoles('Food Operations').then(function(res){
      rolesVisibleFoodOperations=res;
      pageAuthentication.getRoles('Purchase Orders').then(function(res){
        rolesVisiblePurchaseOrders=res;
        pageAuthentication.getRoles('Stock Audits').then(function(res){
          rolesVisibleStockAudits=res;
          pageAuthentication.getRoles('Food Expirys').then(function(res){
            rolesVisibleFoodExpirys=res;
            function arrayUnique(array) {
              var a = array.concat();
                for(var i=0; i<a.length; ++i) {
                  for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                      a.splice(j--, 1);
                  }
                }
              return a;
            }


              // Merges both arrays and gets unique items
            rolesVisibleAll = arrayUnique(rolesVisibleFoodOperations.concat(rolesVisiblePurchaseOrders).concat(rolesVisibleStockAudits).concat(rolesVisibleFoodExpirys));

            Menus.addMenuItem('topbar', 'Food Operations', 'foodoperationsMenuItem','dropdown', 'foodoperations', 4,rolesVisibleAll);
            Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Food Operations Overview', 'foodoperations','foodoperations',rolesVisibleFoodOperations);
            Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Purchase Orders', 'purchaseorders', 'purchaseorders',rolesVisiblePurchaseOrders);
            Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Stock Audit', 'stockaudits', 'stockaudits',rolesVisibleStockAudits);
            Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Food Expiries', 'foodexpirys', 'foodexpirys',rolesVisibleFoodExpirys);
          });
        });
      });
    }); */

    /* var pages = Pages.query( function(){

      for (var i in pages) {
        //for barcodes
        if (pages[i].pageName === 'Food Operations')
          for(var j in pages[i].roles){
            rolesVisibleFoodOperations.push(pages[i].roles[j]);
            if (rolesVisibleAll.indexOf(pages[i].roles[j]) < 0 )
              rolesVisibleAll.push(pages[i].roles[j]);
          }

        else if (pages[i].pageName === 'Purchase Orders')
          for(var w in pages[i].roles){
            rolesVisiblePurchaseOrders.push(pages[i].roles[w]);
            if (rolesVisibleAll.indexOf(pages[i].roles[w]) < 0 )
              rolesVisibleAll.push(pages[i].roles[w]);
          }

        else if (pages[i].pageName === 'Stock Audits')
          for(var a in pages[i].roles){
            rolesVisibleStockAudits.push(pages[i].roles[a]);
            if (rolesVisibleAll.indexOf(pages[i].roles[a]) < 0 )
              rolesVisibleAll.push(pages[i].roles[a]);
          }

        else if (pages[i].pageName === 'Food Expirys')
          for(var k in pages[i].roles){
            rolesVisibleFoodExpirys.push(pages[i].roles[k]);
            if (rolesVisibleAll.indexOf(pages[i].roles[k]) < 0 )
              rolesVisibleAll.push(pages[i].roles[k]);
          }
      }

      Menus.addMenuItem('topbar', 'Food Operations', 'foodoperationsMenuItem','dropdown', 'foodoperations', 4,rolesVisibleAll);
        Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Food Operations Overview', 'foodoperations','foodoperations',rolesVisibleFoodOperations);
        Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Purchase Orders', 'purchaseorders', 'purchaseorders',rolesVisiblePurchaseOrders);
        Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Stock Audit', 'stockaudits', 'stockaudits',rolesVisibleStockAudits);
        Menus.addSubMenuItem('topbar', 'foodoperationsMenuItem', 'Food Expiries', 'foodexpirys', 'foodexpirys',rolesVisibleFoodExpirys);

    }); */
//  }
// ]);
